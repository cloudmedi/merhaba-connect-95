import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Branch } from "@/pages/Manager/Announcements/types";

interface CreateGroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  branches: Branch[];
}

export function CreateGroupDialog({ isOpen, onClose, onSuccess, branches }: CreateGroupDialogProps) {
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);

  const handleCreateGroup = async () => {
    if (!newGroupName) {
      toast.error("Please enter a group name");
      return;
    }

    try {
      // Create group
      const { data: group, error: groupError } = await supabase
        .from('branch_groups')
        .insert({
          name: newGroupName,
          description: newGroupDescription
        })
        .select()
        .single();

      if (groupError) throw groupError;

      // Assign branches to group
      if (selectedBranches.length > 0) {
        const { error: assignError } = await supabase
          .from('branch_group_assignments')
          .insert(
            selectedBranches.map(branchId => ({
              branch_id: branchId,
              group_id: group.id
            }))
          );

        if (assignError) throw assignError;
      }

      toast.success("Group created successfully");
      onClose();
      onSuccess();
      resetForm();
    } catch (error) {
      toast.error("Failed to create group");
    }
  };

  const resetForm = () => {
    setNewGroupName("");
    setNewGroupDescription("");
    setSelectedBranches([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Branch Group</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label>Group Name</Label>
            <Input
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="Enter group name"
            />
          </div>

          <div>
            <Label>Description</Label>
            <Input
              value={newGroupDescription}
              onChange={(e) => setNewGroupDescription(e.target.value)}
              placeholder="Enter description"
            />
          </div>

          <div>
            <Label>Select Branches</Label>
            <ScrollArea className="h-[200px] border rounded-md p-4 mt-2">
              {branches.map((branch) => (
                <div
                  key={branch.id}
                  className="flex items-center space-x-2 py-2"
                >
                  <Checkbox
                    checked={selectedBranches.includes(branch.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedBranches([...selectedBranches, branch.id]);
                      } else {
                        setSelectedBranches(
                          selectedBranches.filter(id => id !== branch.id)
                        );
                      }
                    }}
                  />
                  <div>
                    <p className="text-sm font-medium">{branch.name}</p>
                    <p className="text-xs text-gray-500">{branch.location}</p>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateGroup}>
              Create Group
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}