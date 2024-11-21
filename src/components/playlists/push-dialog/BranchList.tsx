import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Branch } from "@/pages/Manager/Announcements/types";
import { toast } from "sonner";

interface BranchListProps {
  branches: Branch[];
  selectedBranches: string[];
  onBranchToggle: (branchId: string) => void;
  onSelectAll: (checked: boolean) => void;
  isLoading?: boolean;
}

export function BranchList({ 
  branches, 
  selectedBranches, 
  onBranchToggle, 
  onSelectAll,
  isLoading = false 
}: BranchListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBranches = branches.filter(branch =>
    branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (branch.location && branch.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const areAllSelected = filteredBranches.length > 0 && 
    filteredBranches.every(branch => selectedBranches.includes(branch.id));

  const handleBranchToggle = (branchId: string) => {
    onBranchToggle(branchId);
    toast.success(
      selectedBranches.includes(branchId) 
        ? "Branch removed" 
        : "Branch added"
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <p className="text-gray-500">Loading branches...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search branches..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex items-center space-x-2 px-1">
        <Checkbox
          checked={areAllSelected}
          onCheckedChange={onSelectAll}
          id="select-all"
        />
        <label htmlFor="select-all" className="text-sm font-medium">
          Select All
        </label>
      </div>

      <ScrollArea className="h-[300px]">
        <div className="grid grid-cols-2 gap-3 p-1">
          {filteredBranches.map((branch) => (
            <div
              key={branch.id}
              className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-accent cursor-pointer"
              onClick={() => handleBranchToggle(branch.id)}
            >
              <Checkbox
                checked={selectedBranches.includes(branch.id)}
                onCheckedChange={() => handleBranchToggle(branch.id)}
              />
              <div>
                <h4 className="text-sm font-medium">{branch.name}</h4>
                {branch.location && (
                  <p className="text-sm text-gray-500">{branch.location}</p>
                )}
              </div>
            </div>
          ))}
          {filteredBranches.length === 0 && (
            <div className="col-span-2 text-center py-8 text-gray-500">
              No branches found
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}