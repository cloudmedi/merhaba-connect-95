import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Building2, Users } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";

interface Branch {
  id: number;
  name: string;
  location: string;
  type: string;
}

interface BranchGroup {
  id: number;
  name: string;
  branches: Branch[];
}

interface PushPlaylistDialogProps {
  isOpen: boolean;
  onClose: () => void;
  playlistTitle: string;
}

export function PushPlaylistDialog({ isOpen, onClose, playlistTitle }: PushPlaylistDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTargets, setSelectedTargets] = useState<number[]>([]);

  // Mock data - gerçek uygulamada API'den gelecek
  const branches: Branch[] = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: `Branch ${i + 1}`,
    location: "Location 1",
    type: i % 2 === 0 ? "Plaza" : "Street",
  }));

  const branchGroups: BranchGroup[] = [
    { id: 1, name: "City Center Branches", branches: branches.slice(0, 3) },
    { id: 2, name: "Mall Branches", branches: branches.slice(3, 6) },
    { id: 3, name: "Street Branches", branches: branches.slice(6, 9) },
  ];

  const handleTargetToggle = (targetId: number) => {
    setSelectedTargets(prev => {
      if (prev.includes(targetId)) {
        return prev.filter(id => id !== targetId);
      } else {
        return [...prev, targetId];
      }
    });
  };

  const handleSelectAllIndividualBranches = (checked: boolean) => {
    if (checked) {
      const filteredBranchIds = filteredBranches.map(branch => branch.id);
      setSelectedTargets(prev => [...new Set([...prev, ...filteredBranchIds])]);
    } else {
      const filteredBranchIds = filteredBranches.map(branch => branch.id);
      setSelectedTargets(prev => prev.filter(id => !filteredBranchIds.includes(id)));
    }
  };

  const handlePush = () => {
    // API çağrısı yapılacak
    console.log("Pushing playlist to selected targets:", selectedTargets);
    onClose();
  };

  const filteredBranches = branches.filter(branch =>
    branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    branch.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const areAllFilteredBranchesSelected = filteredBranches.length > 0 && 
    filteredBranches.every(branch => selectedTargets.includes(branch.id));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Push Playlist
          </DialogTitle>
          <p className="text-sm text-gray-500">
            Select targets for "{playlistTitle}"
          </p>
        </DialogHeader>

        <Tabs defaultValue="individual">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="individual" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Individual Branches
            </TabsTrigger>
            <TabsTrigger value="groups" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Branch Groups
            </TabsTrigger>
          </TabsList>

          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="search"
                placeholder="Search branches..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <ScrollArea className="h-[400px] mt-4">
            <TabsContent value="individual" className="space-y-4">
              <div className="flex items-center space-x-2 px-4">
                <Checkbox
                  checked={areAllFilteredBranchesSelected}
                  onCheckedChange={handleSelectAllIndividualBranches}
                />
                <span className="text-sm font-medium">Select All</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {filteredBranches.map((branch) => (
                  <div
                    key={branch.id}
                    className="flex items-start space-x-2 p-4 rounded-lg border hover:bg-gray-50"
                  >
                    <Checkbox
                      checked={selectedTargets.includes(branch.id)}
                      onCheckedChange={() => handleTargetToggle(branch.id)}
                    />
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{branch.name}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{branch.location}</span>
                        <span>•</span>
                        <span>{branch.type}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="groups" className="space-y-4">
              {branchGroups.map((group) => (
                <div key={group.id} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={group.branches.every(b => selectedTargets.includes(b.id))}
                      onCheckedChange={() => {
                        const branchIds = group.branches.map(b => b.id);
                        if (group.branches.every(b => selectedTargets.includes(b.id))) {
                          setSelectedTargets(prev => prev.filter(id => !branchIds.includes(id)));
                        } else {
                          setSelectedTargets(prev => [...new Set([...prev, ...branchIds])]);
                        }
                      }}
                    />
                    <h3 className="font-medium">{group.name}</h3>
                  </div>
                  <div className="ml-6 grid grid-cols-2 gap-2">
                    {group.branches.map((branch) => (
                      <div
                        key={branch.id}
                        className="flex items-start space-x-2 p-2 rounded-lg border hover:bg-gray-50"
                      >
                        <Checkbox
                          checked={selectedTargets.includes(branch.id)}
                          onCheckedChange={() => handleTargetToggle(branch.id)}
                        />
                        <div className="space-y-1">
                          <p className="text-sm">{branch.name}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{branch.location}</span>
                            <span>•</span>
                            <span>{branch.type}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-500">
            {selectedTargets.length} targets selected
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handlePush}
              disabled={selectedTargets.length === 0}
              className="bg-[#6366F1] text-white hover:bg-[#5558DD]"
            >
              Push Playlist
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}