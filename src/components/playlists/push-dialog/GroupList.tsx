import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";

interface Group {
  id: string;
  name: string;
  description?: string;
  branch_group_assignments?: Array<{
    branches?: {
      devices?: Array<{
        id: string;
        name: string;
        status: 'online' | 'offline';
      }>;
    };
  }>;
}

interface GroupListProps {
  groups: Group[];
  selectedDevices: string[];
  onSelectGroup: (groupId: string, isSelected: boolean) => void;
}

export function GroupList({ groups, selectedDevices, onSelectGroup }: GroupListProps) {
  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-2">
        {groups.map((group) => {
          const deviceIds = group.branch_group_assignments?.flatMap(
            (assignment) => assignment.branches?.devices?.map(d => d.id) || []
          ) || [];
          const isFullySelected = deviceIds.length > 0 && deviceIds.every(id => selectedDevices.includes(id));
          const isPartiallySelected = deviceIds.some(id => selectedDevices.includes(id));

          return (
            <div
              key={group.id}
              className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-accent/50 cursor-pointer"
              onClick={() => onSelectGroup(group.id, !isFullySelected)}
            >
              <Checkbox
                checked={isFullySelected}
                className={isPartiallySelected && !isFullySelected ? "opacity-50" : ""}
                onCheckedChange={() => onSelectGroup(group.id, !isFullySelected)}
              />
              <div>
                <p className="font-medium">{group.name}</p>
                <p className="text-sm text-gray-500">
                  {deviceIds.length} cihaz
                </p>
                {group.description && (
                  <p className="text-sm text-gray-500 mt-1">{group.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}