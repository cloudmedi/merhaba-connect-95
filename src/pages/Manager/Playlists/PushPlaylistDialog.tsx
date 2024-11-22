import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PushPlaylistDialogProps {
  isOpen: boolean;
  onClose: () => void;
  playlistTitle: string;
}

export function PushPlaylistDialog({ isOpen, onClose, playlistTitle }: PushPlaylistDialogProps) {
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: branches, isLoading: isLoadingBranches } = useQuery({
    queryKey: ['branches'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();

      if (!profile?.company_id) throw new Error('No company associated with user');

      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .eq('company_id', profile.company_id);

      if (error) throw error;
      return data;
    }
  });

  const { data: groups, isLoading: isLoadingGroups } = useQuery({
    queryKey: ['branch-groups'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();

      if (!profile?.company_id) throw new Error('No company associated with user');

      const { data, error } = await supabase
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
        `)
        .eq('company_id', profile.company_id);

      if (error) throw error;
      return data;
    }
  });

  const handleSelectAll = () => {
    if (branches) {
      if (selectedBranches.length === branches.length) {
        setSelectedBranches([]);
      } else {
        setSelectedBranches(branches.map(b => b.id));
      }
    }
  };

  const handleGroupSelect = (groupId: string) => {
    const group = groups?.find(g => g.id === groupId);
    if (group) {
      const branchIds = group.branch_group_assignments
        .map(assignment => assignment.branches?.id)
        .filter(Boolean) as string[];
      
      setSelectedBranches(prev => {
        const newSelection = new Set(prev);
        branchIds.forEach(id => {
          if (newSelection.has(id)) {
            newSelection.delete(id);
          } else {
            newSelection.add(id);
          }
        });
        return Array.from(newSelection);
      });
    }
  };

  const filteredBranches = branches?.filter(branch =>
    branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    branch.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePush = async () => {
    if (selectedBranches.length === 0) {
      toast.error("Please select at least one branch");
      return;
    }

    try {
      // Here you would implement the actual push logic
      toast.success(`Playlist "${playlistTitle}" pushed to ${selectedBranches.length} branches`);
      onClose();
      setSelectedBranches([]);
    } catch (error) {
      toast.error("Failed to push playlist");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Push Playlist</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="branches">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="branches">Branches</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
          </TabsList>

          <TabsContent value="branches" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search branches..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button 
                variant="ghost" 
                onClick={handleSelectAll}
                className="ml-4"
              >
                {branches && selectedBranches.length === branches.length ? "Deselect All" : "Select All"}
              </Button>
            </div>

            <ScrollArea className="h-[300px] rounded-md border p-4">
              {isLoadingBranches ? (
                <div className="text-center py-4 text-gray-500">Loading branches...</div>
              ) : filteredBranches?.length === 0 ? (
                <div className="text-center py-4 text-gray-500">No branches found</div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {filteredBranches?.map((branch) => (
                    <div
                      key={branch.id}
                      className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-accent cursor-pointer"
                      onClick={() => setSelectedBranches(prev => 
                        prev.includes(branch.id) 
                          ? prev.filter(id => id !== branch.id)
                          : [...prev, branch.id]
                      )}
                    >
                      <Checkbox
                        checked={selectedBranches.includes(branch.id)}
                        onCheckedChange={() => setSelectedBranches(prev => 
                          prev.includes(branch.id) 
                            ? prev.filter(id => id !== branch.id)
                            : [...prev, branch.id]
                        )}
                      />
                      <div>
                        <p className="font-medium text-sm">{branch.name}</p>
                        {branch.location && (
                          <p className="text-xs text-gray-500">{branch.location}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="groups" className="space-y-4">
            <ScrollArea className="h-[300px] rounded-md border p-4">
              {isLoadingGroups ? (
                <div className="text-center py-4 text-gray-500">Loading groups...</div>
              ) : groups?.length === 0 ? (
                <div className="text-center py-4 text-gray-500">No groups found</div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {groups?.map((group) => (
                    <div
                      key={group.id}
                      className="flex flex-col p-4 rounded-lg border hover:bg-accent cursor-pointer"
                      onClick={() => handleGroupSelect(group.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          checked={group.branch_group_assignments
                            .every(assignment => 
                              assignment.branches?.id && 
                              selectedBranches.includes(assignment.branches.id)
                            )}
                          onCheckedChange={() => handleGroupSelect(group.id)}
                        />
                        <div>
                          <p className="font-medium text-sm">{group.name}</p>
                          {group.description && (
                            <p className="text-xs text-gray-500">{group.description}</p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">
                            {group.branch_group_assignments.length} branches
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-500">
            {selectedBranches.length} branches selected
          </p>
          <div className="space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handlePush}>
              Push to Branches
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}