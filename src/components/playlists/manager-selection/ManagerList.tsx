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
  const getInitial = (manager: Manager) => {
    if (manager.firstName) return manager.firstName[0];
    if (manager.email) return manager.email[0];
    return "?";
  };

  const getDisplayName = (manager: Manager) => {
    if (manager.firstName && manager.lastName) {
      return `${manager.firstName} ${manager.lastName}`;
    }
    return "Unnamed User";
  };

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
              key={manager.id || manager._id}
              className="flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer"
              onClick={() => onSelectManager(manager)}
            >
              <Checkbox
                checked={selectedManagers.some(m => (m.id || m._id) === (manager.id || manager._id))}
                onCheckedChange={() => onSelectManager(manager)}
              />
              <Avatar className="h-8 w-8">
                <div className="bg-purple-100 text-purple-600 h-full w-full flex items-center justify-center">
                  {getInitial(manager).toUpperCase()}
                </div>
              </Avatar>
              <div>
                <div className="font-medium">{getDisplayName(manager)}</div>
                <div className="text-sm text-gray-500">{manager.email}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </ScrollArea>
  );
}