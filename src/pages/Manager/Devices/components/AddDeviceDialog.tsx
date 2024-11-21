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

export function AddDeviceDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<"player" | "display" | "controller">("player");
  const [location, setLocation] = useState("");
  const [token, setToken] = useState("");
  const { createDevice } = useDevices();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await createDevice.mutateAsync({
      name,
      category,
      location,
      token,
      status: 'offline',
      schedule: {},
      system_info: {},
    });

    onOpenChange(false);
    setName("");
    setCategory("player");
    setLocation("");
    setToken("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Device</DialogTitle>
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
            <Label htmlFor="token">Device Token</Label>
            <Input
              id="token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter device token"
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