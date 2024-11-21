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

interface AddDeviceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddDeviceDialog({ open, onOpenChange }: AddDeviceDialogProps) {
  const [branchName, setBranchName] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState<"player" | "display" | "controller">("player");
  const [token, setToken] = useState("");
  const { createDevice } = useDevices();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await createDevice.mutateAsync({
      name: branchName,
      branch_id: location, // In a real app, you'd have a branch selector
      category,
      status: 'offline',
      system_info: {},
      schedule: {},
      token: token // Add token to the device data
    });

    onOpenChange(false);
    setBranchName("");
    setLocation("");
    setCategory("player");
    setToken("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Device</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="branchName">Device Name</Label>
            <Input
              id="branchName"
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
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
              placeholder="Enter branch location"
              className="w-full"
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
            <Label htmlFor="token">Pairing Token</Label>
            <Input
              id="token"
              value={token}
              onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter 6-digit token from Windows Player"
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