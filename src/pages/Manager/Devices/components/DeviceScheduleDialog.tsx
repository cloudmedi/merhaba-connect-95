import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Device, DeviceSchedule } from '../hooks/types';

interface DeviceScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  device: Device;
}

export function DeviceScheduleDialog({ open, onOpenChange, device }: DeviceScheduleDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule for {device.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <p>Power On: {device.schedule.powerOn || 'Not set'}</p>
            <p>Power Off: {device.schedule.powerOff || 'Not set'}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}