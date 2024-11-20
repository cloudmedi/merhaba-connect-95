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

interface AddDeviceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddDeviceDialog({ open, onOpenChange }: AddDeviceDialogProps) {
  const [branchName, setBranchName] = useState("");
  const [token, setToken] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (token.length !== 6) {
      toast.error("Token must be 6 digits");
      return;
    }

    // Here you would typically make an API call to register the device
    toast.success("Device added successfully");
    onOpenChange(false);
    setBranchName("");
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
            <Label htmlFor="branchName">Branch Name</Label>
            <Input
              id="branchName"
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
              placeholder="Enter branch name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="token">Device Token</Label>
            <Input
              id="token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter 6-digit token"
              maxLength={6}
              pattern="[0-9]{6}"
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit">Add Device</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}