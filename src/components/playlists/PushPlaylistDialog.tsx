import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface PushPlaylistDialogProps {
  isOpen: boolean;
  onClose: () => void;
  playlistTitle: string;
}

// Mock data - replace with actual API data
const MOCK_BRANCHES = [
  { id: "1", name: "Branch 1", location: "Location 1" },
  { id: "2", name: "Branch 2", location: "Location 2" },
  { id: "3", name: "Branch 3", location: "Location 3" },
];

export function PushPlaylistDialog({ isOpen, onClose, playlistTitle }: PushPlaylistDialogProps) {
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);

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
      setSelectedBranches([]);
    } catch (error) {
      toast.error("Failed to push playlist");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">Push Playlist</DialogTitle>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onClose}
              className="h-6 w-6 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Select branches to push "{playlistTitle}"
          </p>
        </DialogHeader>

        <div className="mt-4">
          <div className="border rounded-lg">
            {MOCK_BRANCHES.map((branch) => (
              <div
                key={branch.id}
                className="flex items-start p-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                onClick={() => handleBranchToggle(branch.id)}
              >
                <Checkbox
                  checked={selectedBranches.includes(branch.id)}
                  onCheckedChange={() => handleBranchToggle(branch.id)}
                  className="mt-1"
                />
                <div className="ml-3">
                  <h4 className="text-sm font-medium">{branch.name}</h4>
                  <p className="text-sm text-gray-500">{branch.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <span className="text-sm text-gray-500">
            {selectedBranches.length} branches selected
          </span>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handlePush}
              disabled={selectedBranches.length === 0}
              className="bg-[#1A1F2C] text-white hover:bg-[#2A2F3C]"
            >
              Push to Branches
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}