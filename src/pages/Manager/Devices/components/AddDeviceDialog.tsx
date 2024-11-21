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
import { useDevices } from "../hooks/useDevices";

export function AddDeviceDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [location, setLocation] = useState("");
  const { createDevice } = useDevices();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await createDevice.mutateAsync({
      name,
      token,
      location,
      category: "player", // Default category since we removed the selection
      status: 'offline',
      schedule: {},
      system_info: {},
    });

    onOpenChange(false);
    setName("");
    setToken("");
    setLocation("");
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
            <Label htmlFor="token">Device Token</Label>
            <Input
              id="token"
              value={token}
              onChange={(e) => {
                // Only allow 6 digits
                const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
                setToken(value);
              }}
              placeholder="Enter 6-digit token"
              required
              pattern="\d{6}"
              title="Please enter a 6-digit token"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter device location"
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