import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";

interface NewDeviceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Branch {
  id: string;
  name: string;
}

export function NewDeviceDialog({ open, onOpenChange }: NewDeviceDialogProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<"player" | "display" | "controller">("player");
  const [location, setLocation] = useState("");
  const [token, setToken] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<string>("");
  const { createDevice } = useDevices();

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const { data: branchesData, error } = await supabase
        .from('branches')
        .select('id, name');

      if (error) throw error;
      setBranches(branchesData || []);
      if (branchesData && branchesData.length > 0) {
        setSelectedBranchId(branchesData[0].id);
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
      toast.error('Failed to load branches');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedBranchId) {
      toast.error('Please select a branch');
      return;
    }

    try {
      // First verify the token
      const { data: tokenData, error: tokenError } = await supabase
        .from('device_tokens')
        .select('*')
        .eq('token', token)
        .eq('status', 'active')
        .single();

      if (tokenError || !tokenData) {
        toast.error('Invalid or expired token');
        return;
      }

      // Create the device
      await createDevice.mutateAsync({
        name,
        category,
        location,
        token,
        ip_address: ipAddress,
        status: 'offline',
        schedule: {},
        system_info: {},
        branch_id: selectedBranchId
      });

      // Update token status to used
      await supabase
        .from('device_tokens')
        .update({ status: 'used' })
        .eq('token', token);

      toast.success('Device added successfully');
      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add device');
    }
  };

  const resetForm = () => {
    setName("");
    setCategory("player");
    setLocation("");
    setToken("");
    setIpAddress("");
    setSelectedBranchId(branches[0]?.id || "");
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
            <Label htmlFor="branch">Branch</Label>
            <Select value={selectedBranchId} onValueChange={setSelectedBranchId}>
              <SelectTrigger>
                <SelectValue placeholder="Select branch" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </SelectItem>
                ))}
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
            <Label htmlFor="ipAddress">IP Address</Label>
            <Input
              id="ipAddress"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              placeholder="Enter IP address"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="token">Device Token</Label>
            <Input
              id="token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter device token"
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