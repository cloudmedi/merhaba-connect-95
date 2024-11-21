import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { BranchList } from "./push-dialog/BranchList";
import { GroupList } from "./push-dialog/GroupList";

interface PushPlaylistDialogProps {
  isOpen: boolean;
  onClose: () => void;
  playlistTitle: string;
}

// Mock data - replace with actual API data
const MOCK_BRANCHES = Array.from({ length: 10 }, (_, i) => ({
  id: `branch-${i + 1}`,
  name: `Branch ${i + 1}`,
  location: `Location ${Math.floor(i / 3) + 1}`,
  type: i % 2 === 0 ? "Mall" : "Street",
}));

const MOCK_GROUPS = Array.from({ length: 5 }, (_, i) => ({
  id: `group-${i + 1}`,
  name: `Branch Group ${i + 1}`,
  description: `Group of branches in Region ${i + 1}`,
  branchCount: Math.floor(Math.random() * 5) + 3,
}));

export function PushPlaylistDialog({ isOpen, onClose, playlistTitle }: PushPlaylistDialogProps) {
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("branches");

  const handleBranchToggle = (branchId: string) => {
    setSelectedBranches(prev => {
      if (prev.includes(branchId)) {
        return prev.filter(id => id !== branchId);
      }
      return [...prev, branchId];
    });
  };

  const handleGroupToggle = (groupId: string) => {
    setSelectedGroups(prev => {
      if (prev.includes(groupId)) {
        return prev.filter(id => id !== groupId);
      }
      return [...prev, groupId];
    });
  };

  const handleSelectAllBranches = (checked: boolean) => {
    if (checked) {
      setSelectedBranches(MOCK_BRANCHES.map(branch => branch.id));
    } else {
      setSelectedBranches([]);
    }
  };

  const handleSelectAllGroups = (checked: boolean) => {
    if (checked) {
      setSelectedGroups(MOCK_GROUPS.map(group => group.id));
    } else {
      setSelectedGroups([]);
    }
  };

  const handlePush = async () => {
    if (selectedBranches.length === 0 && selectedGroups.length === 0) {
      toast.error("Please select at least one branch or group");
      return;
    }

    try {
      // Here you would implement the actual push logic
      toast.success(`Playlist "${playlistTitle}" pushed to ${selectedBranches.length} branches and ${selectedGroups.length} groups`);
      onClose();
      setSelectedBranches([]);
      setSelectedGroups([]);
      setActiveTab("branches");
    } catch (error) {
      toast.error("Failed to push playlist");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Push Playlist</DialogTitle>
          <p className="text-sm text-gray-500">
            Select targets for "{playlistTitle}"
          </p>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="branches" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Individual Branches
            </TabsTrigger>
            <TabsTrigger value="groups" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Branch Groups
            </TabsTrigger>
          </TabsList>

          <div className="mt-4">
            <TabsContent value="branches">
              <BranchList
                branches={MOCK_BRANCHES}
                selectedBranches={selectedBranches}
                onBranchToggle={handleBranchToggle}
                onSelectAll={handleSelectAllBranches}
              />
            </TabsContent>

            <TabsContent value="groups">
              <GroupList
                groups={MOCK_GROUPS}
                selectedGroups={selectedGroups}
                onGroupToggle={handleGroupToggle}
                onSelectAll={handleSelectAllGroups}
              />
            </TabsContent>
          </div>
        </Tabs>

        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-500">
            {selectedBranches.length} branches and {selectedGroups.length} groups selected
          </div>
          <div className="space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handlePush}
              disabled={selectedBranches.length === 0 && selectedGroups.length === 0}
              className="bg-[#6366F1] text-white hover:bg-[#5558DD]"
            >
              Push to Selected
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}