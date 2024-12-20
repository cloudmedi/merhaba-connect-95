import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Users } from "lucide-react";
import { Group } from "../types";

interface GroupListProps {
  groups: Group[];
  selectedDevices: string[];
  onDevicesChange: (devices: string[]) => void;
}

export function GroupList({ groups, selectedDevices, onDevicesChange }: GroupListProps) {
  const handleSelectGroup = (group: Group) => {
    const deviceIds = group.devices.map(device => device.id);
    const allSelected = deviceIds.every(id => selectedDevices.includes(id));
    
    if (allSelected) {
      onDevicesChange(selectedDevices.filter(id => !deviceIds.includes(id)));
    } else {
      const newDevices = [...new Set([...selectedDevices, ...deviceIds])];
      onDevicesChange(newDevices);
    }
  };

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-3">
        {groups.map((group) => {
          const deviceIds = group.devices.map(device => device.id);
          const allSelected = deviceIds.length > 0 && deviceIds.every(id => selectedDevices.includes(id));
          const someSelected = deviceIds.some(id => selectedDevices.includes(id));

          return (
            <Card
              key={group.id}
              className={`p-4 cursor-pointer transition-colors hover:bg-accent ${
                allSelected ? "border-primary" : someSelected ? "border-primary/50" : ""
              }`}
              onClick={() => handleSelectGroup(group)}
            >
              <div className="flex items-start space-x-3">
                <Checkbox
                  checked={allSelected}
                  className={someSelected && !allSelected ? "opacity-50" : ""}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <h4 className="text-sm font-medium">{group.name}</h4>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {group.devices.length} cihaz
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </ScrollArea>
  );
}