import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CreateGroupDialog } from "./branch-groups/CreateGroupDialog";
import { GroupList } from "./branch-groups/GroupList";
import { toast } from "sonner";
import type { Branch } from "@/pages/Manager/Announcements/types";

export function BranchGroupsTab() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [groups, setGroups] = useState([]);
  const [branches, setBranches] = useState<Branch[]>([]);

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

      <GroupList groups={groups} />

      <CreateGroupDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={fetchGroups}
        branches={branches}
      />
    </div>
  );
}