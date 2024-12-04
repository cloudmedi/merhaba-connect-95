import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDevices } from "../hooks/useDevices";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface NewDeviceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewDeviceDialog({ open, onOpenChange }: NewDeviceDialogProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<"player" | "display" | "controller">("player");
  const [location, setLocation] = useState("");
  const [token, setToken] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const { createDevice } = useDevices();
  const [isVerifying, setIsVerifying] = useState(false);

  const verifyTokenAndGetDeviceInfo = async (token: string) => {
    try {
      setIsVerifying(true);
      // First verify the token
      const { data: tokenData, error: tokenError } = await supabase
        .from('device_tokens')
        .select('*')
        .eq('token', token)
        .eq('status', 'active')
        .single();

      if (tokenError || !tokenData) {
        toast.error('Geçersiz veya süresi dolmuş token');
        return;
      }

      // Check if token is expired
      if (new Date(tokenData.expires_at) < new Date()) {
        toast.error('Token süresi dolmuş');
        return;
      }

      // Get device info if exists
      const { data: existingDevice } = await supabase
        .from('devices')
        .select('*')
        .eq('token', token)
        .maybeSingle();

      if (existingDevice) {
        setName(existingDevice.name || '');
        setCategory((existingDevice.category as "player" | "display" | "controller") || 'player');
        setLocation(existingDevice.location || '');
        setIpAddress(existingDevice.ip_address || '');
        toast.success('Cihaz bilgileri getirildi');
      }

      // Get current system info
      const systemInfo = await window.electronAPI.getSystemInfo();
      
      return {
        tokenData,
        existingDevice,
        systemInfo
      };

    } catch (error: any) {
      toast.error('Token doğrulama hatası: ' + error.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const deviceInfo = await verifyTokenAndGetDeviceInfo(token);
      if (!deviceInfo) return;

      // Create the device
      await createDevice.mutateAsync({
        name,
        category,
        location,
        token,
        ip_address: ipAddress,
        status: 'offline',
        schedule: {},
        system_info: deviceInfo.systemInfo,
        branch_id: null
      });

      // Update token status to used
      await supabase
        .from('device_tokens')
        .update({ status: 'used' })
        .eq('token', token);

      toast.success('Cihaz başarıyla eklendi');
      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || 'Cihaz eklenirken bir hata oluştu');
    }
  };

  const handleTokenChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newToken = e.target.value;
    setToken(newToken);
    
    if (newToken.length === 6) { // Token uzunluğu 6 karakter olduğunda
      await verifyTokenAndGetDeviceInfo(newToken);
    }
  };

  const resetForm = () => {
    setName("");
    setCategory("player");
    setLocation("");
    setToken("");
    setIpAddress("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Device</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="token">Device Token</Label>
            <Input
              id="token"
              value={token}
              onChange={handleTokenChange}
              placeholder="Enter device token"
              required
              disabled={isVerifying}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Device Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter device name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Device Type</Label>
            <Select value={category} onValueChange={(value: "player" | "display" | "controller") => setCategory(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select device type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="player">Player</SelectItem>
                <SelectItem value="display">Display</SelectItem>
                <SelectItem value="controller">Controller</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter device location"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ipAddress">IP Address</Label>
            <Input
              id="ipAddress"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              placeholder="Enter IP address"
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={createDevice.isPending || isVerifying}>
              {createDevice.isPending ? "Adding..." : "Add Device"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}