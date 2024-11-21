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
import type { Device } from "../hooks/useDevices";

interface EditDeviceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  device: Device;
}

export function EditDeviceDialog({
  open,
  onOpenChange,
  device,
}: EditDeviceDialogProps) {
  const [name, setName] = useState(device.name);
  const [category, setCategory] = useState(device.category);
  const { updateDevice } = useDevices();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await updateDevice.mutateAsync({
      id: device.id,
      name,
      category,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Device</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <DialogFooter>
            <Button type="submit" disabled={updateDevice.isPending}>
              {updateDevice.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}