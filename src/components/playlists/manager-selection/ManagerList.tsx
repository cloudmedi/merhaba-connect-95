import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Manager } from "../types";

interface ManagerListProps {
  managers: Manager[];
  selectedManagers: Manager[];
  onSelectManager: (manager: Manager) => void;
  isLoading: boolean;
}

export function ManagerList({ 
  managers, 
  selectedManagers, 
  onSelectManager,
  isLoading 
}: ManagerListProps) {
  return (
    <ScrollArea className="h-[300px] border rounded-md">
      <div className="p-4 space-y-2">
        {isLoading ? (
          <div className="text-center py-4">Loading managers...</div>
        ) : managers.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No managers found</div>
        ) : (
          managers.map((manager) => (
            <div
              key={manager.id}
              className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
              onClick={() => onSelectManager(manager)}
            >
              <Checkbox
                checked={selectedManagers.some(m => m.id === manager.id)}
                onCheckedChange={() => onSelectManager(manager)}
              />
              <div>
                <div className="font-medium">
                  {manager.first_name && manager.last_name
                    ? `${manager.first_name} ${manager.last_name}`
                    : "Unnamed User"}
                </div>
                <div className="text-sm text-gray-500">{manager.email}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </ScrollArea>
  );
}