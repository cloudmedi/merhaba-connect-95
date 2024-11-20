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
import { useState } from "react";
import { toast } from "sonner";

interface DeviceScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  device: {
    id: string;
    schedule: {
      powerOn: string;
      powerOff: string;
    };
  };
}

export function DeviceScheduleDialog({
  open,
  onOpenChange,
  device,
}: DeviceScheduleDialogProps) {
  const [powerOn, setPowerOn] = useState(device.schedule.powerOn);
  const [powerOff, setPowerOff] = useState(device.schedule.powerOff);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically make an API call to update the schedule
    toast.success("Schedule updated successfully");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Device Schedule</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="powerOn">Power On Time</Label>
            <Input
              id="powerOn"
              type="time"
              value={powerOn}
              onChange={(e) => setPowerOn(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="powerOff">Power Off Time</Label>
            <Input
              id="powerOff"
              type="time"
              value={powerOff}
              onChange={(e) => setPowerOff(e.target.value)}
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit">Save Schedule</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}