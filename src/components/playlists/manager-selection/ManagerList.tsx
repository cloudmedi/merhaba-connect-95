import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Manager } from "../types";
import { Avatar } from "@/components/ui/avatar";

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
              className="flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer"
              onClick={() => onSelectManager(manager)}
            >
              <Checkbox
                checked={selectedManagers.some(m => m.id === manager.id)}
                onCheckedChange={() => onSelectManager(manager)}
              />
              <Avatar className="h-8 w-8">
                <div className="bg-purple-100 text-purple-600 h-full w-full flex items-center justify-center">
                  {(manager.first_name?.[0] || manager.email[0]).toUpperCase()}
                </div>
              </Avatar>
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