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
import { useState } from "react";
import { useDevices } from "../hooks/useDevices";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface AddDeviceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddDeviceDialog({ open, onOpenChange }: AddDeviceDialogProps) {
  const [deviceName, setDeviceName] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState<"player" | "display" | "controller">("player");
  const [token, setToken] = useState("");
  const { createDevice } = useDevices();

  const { data: licenseInfo } = useQuery({
    queryKey: ['licenseInfo'],
    queryFn: async () => {
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('*, licenses(*)')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      const { count: currentDevices } = await supabase
        .from('devices')
        .select('*', { count: 'exact' })
        .eq('branches.company_id', userProfile?.company_id);

      return {
        limit: userProfile?.licenses?.[0]?.quantity || 0,
        used: currentDevices || 0
      };
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!deviceName) {
      toast.error('Please enter a device name');
      return;
    }

    try {
      await createDevice.mutateAsync({
        name: deviceName,
        location: location,
        category,
        status: 'offline',
        system_info: {},
        schedule: {},
        token
      });

      onOpenChange(false);
      setDeviceName("");
      setLocation("");
      setCategory("player");
      setToken("");
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const isNearLimit = licenseInfo && (licenseInfo.limit - licenseInfo.used <= 2);
  const remainingLicenses = licenseInfo ? licenseInfo.limit - licenseInfo.used : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Device</DialogTitle>
        </DialogHeader>
        
        {isNearLimit && (
          <Alert variant="warning" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You have {remainingLicenses} device license{remainingLicenses !== 1 ? 's' : ''} remaining.
              Contact your administrator to increase your license limit.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="deviceName">Device Name</Label>
            <Input
              id="deviceName"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              placeholder="Enter device name"
              className="w-full"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter location"
              className="w-full"
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
            <Label htmlFor="token">Pairing Code</Label>
            <Input
              id="token"
              value={token}
              onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter 6-digit code from Windows Player"
              className="w-full"
              maxLength={6}
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={createDevice.isPending}>
              {createDevice.isPending ? "Adding..." : "Add Device"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}