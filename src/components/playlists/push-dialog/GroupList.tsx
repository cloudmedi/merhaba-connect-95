import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface Group {
  id: string;
  name: string;
  description: string;
  branchCount: number;
}

interface GroupListProps {
  groups: Group[];
  selectedGroups: string[];
  onGroupToggle: (groupId: string) => void;
  onSelectAll: (checked: boolean) => void;
}

export function GroupList({ groups, selectedGroups, onGroupToggle, onSelectAll }: GroupListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const areAllSelected = filteredGroups.length > 0 && 
    filteredGroups.every(group => selectedGroups.includes(group.id));

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search groups..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex items-center space-x-2 px-1">
        <Checkbox
          checked={areAllSelected}
          onCheckedChange={onSelectAll}
          id="select-all-groups"
        />
        <label htmlFor="select-all-groups" className="text-sm font-medium">
          Select All
        </label>
      </div>

      <ScrollArea className="h-[300px]">
        <div className="grid grid-cols-2 gap-3 p-1">
          {filteredGroups.map((group) => (
            <div
              key={group.id}
              className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-accent cursor-pointer"
              onClick={() => onGroupToggle(group.id)}
            >
              <Checkbox
                checked={selectedGroups.includes(group.id)}
                onCheckedChange={() => onGroupToggle(group.id)}
              />
              <div>
                <h4 className="text-sm font-medium">{group.name}</h4>
                <p className="text-sm text-gray-500">{group.description}</p>
                <p className="text-xs text-gray-400 mt-1">{group.branchCount} branches</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}