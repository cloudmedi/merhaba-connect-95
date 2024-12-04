import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import type { Branch } from "@/pages/Manager/Announcements/types";

interface BranchSelectionProps {
  branches: Branch[];
  selectedBranches: string[];
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  setSelectedBranches: (value: string[]) => void;
}

export function BranchSelection({ 
  branches, 
  selectedBranches, 
  searchQuery, 
  setSearchQuery, 
  setSelectedBranches 
}: BranchSelectionProps) {
  const filteredBranches = branches.filter(branch =>
    branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (branch.location || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAll = () => {
    if (selectedBranches.length === filteredBranches.length) {
      setSelectedBranches([]);
    } else {
      setSelectedBranches(filteredBranches.map(b => b.id));
    }
  };

  const toggleBranch = (branchId: string) => {
    setSelectedBranches(
      selectedBranches.includes(branchId)
        ? selectedBranches.filter(id => id !== branchId)
        : [...selectedBranches, branchId]
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Şube ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button 
          variant="outline" 
          onClick={handleSelectAll}
          className="whitespace-nowrap"
        >
          {selectedBranches.length === filteredBranches.length ? "Seçimi Kaldır" : "Tümünü Seç"}
        </Button>
      </div>

      <ScrollArea className="h-[300px] rounded-md border p-4">
        <div className="space-y-4">
          {filteredBranches.map((branch) => (
            <div
              key={branch.id}
              className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-accent cursor-pointer"
              onClick={() => toggleBranch(branch.id)}
            >
              <Checkbox
                checked={selectedBranches.includes(branch.id)}
                onCheckedChange={() => toggleBranch(branch.id)}
              />
              <div>
                <p className="font-medium text-sm">{branch.name}</p>
                {branch.location && (
                  <p className="text-sm text-gray-500">{branch.location}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}