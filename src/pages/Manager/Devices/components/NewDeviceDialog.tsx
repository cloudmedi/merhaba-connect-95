import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useDevices } from "../hooks/useDevices";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useDeviceVerification } from "./device-verification/useDeviceVerification";
import { DeviceForm } from "./device-verification/DeviceForm";

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
  const { isVerifying, verifyTokenAndGetDeviceInfo } = useDeviceVerification();

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

  const handleTokenChange = async (newToken: string) => {
    const deviceInfo = await verifyTokenAndGetDeviceInfo(newToken);
    if (deviceInfo?.existingDevice) {
      setName(deviceInfo.existingDevice.name || '');
      setCategory((deviceInfo.existingDevice.category as "player" | "display" | "controller") || 'player');
      setLocation(deviceInfo.existingDevice.location || '');
      setIpAddress(deviceInfo.existingDevice.ip_address || '');
      toast.success('Cihaz bilgileri getirildi');
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
          <DeviceForm
            name={name}
            setName={setName}
            category={category}
            setCategory={setCategory}
            location={location}
            setLocation={setLocation}
            token={token}
            setToken={setToken}
            ipAddress={ipAddress}
            setIpAddress={setIpAddress}
            isVerifying={isVerifying}
            onTokenChange={handleTokenChange}
          />
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