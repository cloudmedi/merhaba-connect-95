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
import { generateDeviceToken } from "@/utils/tokenGenerator";

interface NewDeviceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewDeviceDialog({ open, onOpenChange }: NewDeviceDialogProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<"player" | "display" | "controller">("player");
  const [location, setLocation] = useState("");
  const [token, setToken] = useState("");
  const { createDevice } = useDevices();

  // Generate token when dialog opens
  useState(() => {
    if (open) {
      setToken(generateDeviceToken());
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createDevice.mutateAsync({
        name,
        category,
        location,
        token,
        status: 'offline',
        schedule: {},
        system_info: {},
        branches: null
      });

      toast.success('Device added successfully');
      onOpenChange(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to add device');
    }
  };

  const resetForm = () => {
    setName("");
    setCategory("player");
    setLocation("");
    setToken(generateDeviceToken()); // Generate new token when form resets
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
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
            <div className="flex gap-2">
              <Input
                id="token"
                value={token}
                readOnly
                className="bg-gray-50 font-mono text-lg tracking-wider text-center"
              />
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(token);
                  toast.success('Token copied to clipboard');
                }}
              >
                Copy
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              Enter this token in your device application to complete pairing
            </p>
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