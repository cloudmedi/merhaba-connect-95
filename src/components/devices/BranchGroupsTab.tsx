import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Branch {
  id: string;
  name: string;
  location: string;
}

interface BranchGroup {
  id: string;
  name: string;
  description: string;
  branches?: Branch[];
}

export function BranchGroupsTab() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [groups, setGroups] = useState<BranchGroup[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");

  const fetchGroups = async () => {
    const { data: groupsData, error: groupsError } = await supabase
      .from('branch_groups')
      .select(`
        id,
        name,
        description,
        branch_group_assignments (
          branches (
            id,
            name,
            location
          )
        )
      `);

    if (groupsError) {
      toast.error("Failed to load groups");
      return;
    }

    setGroups(groupsData || []);
  };

  const fetchBranches = async () => {
    const { data, error } = await supabase
      .from('branches')
      .select('id, name, location');

    if (error) {
      toast.error("Failed to load branches");
      return;
    }

    setBranches(data || []);
  };

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
      setIsCreateDialogOpen(false);
      setNewGroupName("");
      setNewGroupDescription("");
      setSelectedBranches([]);
      fetchGroups();
    } catch (error) {
      toast.error("Failed to create group");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button 
          onClick={() => setIsCreateDialogOpen(true)}
          className="ml-4"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Group
        </Button>
      </div>

      <ScrollArea className="h-[400px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groups.map((group) => (
            <div
              key={group.id}
              className="p-4 border rounded-lg hover:bg-accent"
            >
              <h3 className="font-medium">{group.name}</h3>
              {group.description && (
                <p className="text-sm text-gray-500 mt-1">{group.description}</p>
              )}
              <div className="mt-2">
                <span className="text-xs text-gray-500">
                  {group.branches?.length || 0} branches
                </span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
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
                onClick={() => setIsCreateDialogOpen(false)}
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
    </div>
  );
}