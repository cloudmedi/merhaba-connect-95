import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Building2, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";

interface Branch {
  id: string;
  name: string;
  location: string;
}

const SAMPLE_BRANCHES: Branch[] = [
  { id: "1", name: "Downtown Mall", location: "City Center" },
  { id: "2", name: "Airport Terminal", location: "Airport District" },
  { id: "3", name: "Central Plaza", location: "Business District" },
  { id: "4", name: "Waterfront Store", location: "Harbor Area" },
  { id: "5", name: "Metro Station", location: "Transit Hub" },
];

interface BranchSelectionStepProps {
  selectedBranches: string[];
  onBranchesChange: (branches: string[]) => void;
  onBack: () => void;
  onCreate: () => void;
}

export function BranchSelectionStep({ 
  selectedBranches, 
  onBranchesChange,
  onBack,
  onCreate 
}: BranchSelectionStepProps) {
  const handleSelectAll = () => {
    if (selectedBranches.length === SAMPLE_BRANCHES.length) {
      onBranchesChange([]);
    } else {
      onBranchesChange(SAMPLE_BRANCHES.map(branch => branch.id));
    }
  };

  const toggleBranch = (branchId: string) => {
    if (selectedBranches.includes(branchId)) {
      onBranchesChange(selectedBranches.filter(id => id !== branchId));
    } else {
      onBranchesChange([...selectedBranches, branchId]);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="branches">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="branches" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Branches
          </TabsTrigger>
          <TabsTrigger value="groups" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Groups
          </TabsTrigger>
        </TabsList>

        <TabsContent value="branches" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search branches..."
                className="pl-10"
              />
            </div>
            <Button 
              variant="link" 
              onClick={handleSelectAll}
              className="ml-4"
            >
              Select All
            </Button>
          </div>

          <ScrollArea className="h-[300px]">
            <div className="grid grid-cols-2 gap-3">
              {SAMPLE_BRANCHES.map((branch) => (
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
                    <h4 className="text-sm font-medium">{branch.name}</h4>
                    <p className="text-sm text-gray-500">{branch.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="groups">
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            Group selection coming soon...
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button 
          onClick={onCreate}
          disabled={selectedBranches.length === 0}
          className="bg-[#6E59A5] hover:bg-[#5a478a] text-white"
        >
          Create Event
        </Button>
      </div>
    </div>
  );
}