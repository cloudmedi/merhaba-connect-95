import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
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

  const { data: branches, isLoading } = useQuery({
    queryKey: ['branches'],
    queryFn: async () => {
      // Mock data for now - replace with actual API call
      return [
        { id: '1', name: 'Branch 1', location: 'Location 1' },
        { id: '2', name: 'Branch 2', location: 'Location 2' },
        { id: '3', name: 'Branch 3', location: 'Location 3' },
      ];
    }
  });

  const handleBranchToggle = (branchId: string) => {
    setSelectedBranches(prev => {
      if (prev.includes(branchId)) {
        return prev.filter(id => id !== branchId);
      }
      return [...prev, branchId];
    });
  };

  const handlePush = async () => {
    if (selectedBranches.length === 0) {
      toast.error("Please select at least one branch");
      return;
    }

    try {
      // Here you would implement the actual push logic
      toast.success(`Playlist "${playlistTitle}" pushed to ${selectedBranches.length} branches`);
      onClose();
    } catch (error) {
      toast.error("Failed to push playlist");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Push Playlist</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <h4 className="text-sm font-medium mb-3">
            Select branches to push "{playlistTitle}"
          </h4>

          <ScrollArea className="h-[300px] rounded-md border p-4">
            {isLoading ? (
              <div className="text-center py-4 text-gray-500">Loading branches...</div>
            ) : branches?.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No branches found</div>
            ) : (
              <div className="space-y-4">
                {branches?.map((branch) => (
                  <div
                    key={branch.id}
                    className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50"
                  >
                    <Checkbox
                      checked={selectedBranches.includes(branch.id)}
                      onCheckedChange={() => handleBranchToggle(branch.id)}
                    />
                    <div>
                      <p className="font-medium text-sm">{branch.name}</p>
                      <p className="text-xs text-gray-500">{branch.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

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