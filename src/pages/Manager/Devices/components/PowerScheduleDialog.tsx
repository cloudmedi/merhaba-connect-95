import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import type { Device } from "../hooks/types";
import { toast } from "sonner";

interface PowerScheduleDialogProps {
  device: Device;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (device: Partial<Device>) => void;
}

export function PowerScheduleDialog({
  device,
  open,
  onOpenChange,
  onSave
}: PowerScheduleDialogProps) {
  const [powerOn, setPowerOn] = useState(device.schedule?.powerOn || "");
  const [powerOff, setPowerOff] = useState(device.schedule?.powerOff || "");

  const handleSave = () => {
    if (!powerOn || !powerOff) {
      toast.error("Lütfen açılış ve kapanış saatlerini belirleyin");
      return;
    }

    const schedule = {
      ...device.schedule,
      powerOn,
      powerOff
    };

    onSave({
      id: device.id,
      schedule
    });
    
    onOpenChange(false);
    toast.success("Güç programı güncellendi");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Güç Programı - {device.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="powerOn">Açılış Saati</Label>
            <Input
              id="powerOn"
              type="time"
              value={powerOn}
              onChange={(e) => setPowerOn(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="powerOff">Kapanış Saati</Label>
            <Input
              id="powerOff"
              type="time"
              value={powerOff}
              onChange={(e) => setPowerOff(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            İptal
          </Button>
          <Button onClick={handleSave}>
            Kaydet
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}