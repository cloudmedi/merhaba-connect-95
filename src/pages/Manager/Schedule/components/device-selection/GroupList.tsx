import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { FolderOpen } from "lucide-react";

interface GroupListProps {
  groups: any[];
  selectedDevices: string[];
  onSelectGroup: (group: any, isSelected: boolean) => void;
}

export function GroupList({ groups, selectedDevices, onSelectGroup }: GroupListProps) {
  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-3">
        {groups.map((group) => {
          const deviceIds = group.devices.map((device: any) => device.id);
          const allSelected = deviceIds.length > 0 && deviceIds.every(id => selectedDevices.includes(id));
          const someSelected = deviceIds.some(id => selectedDevices.includes(id));

          return (
            <div
              key={group.id}
              className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-accent cursor-pointer"
              onClick={() => onSelectGroup(group, !allSelected)}
            >
              <Checkbox
                checked={allSelected}
                className={someSelected && !allSelected ? "opacity-50" : ""}
                onCheckedChange={(checked) => onSelectGroup(group, !!checked)}
              />
              <div>
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-gray-500" />
                  <h4 className="text-sm font-medium">{group.name}</h4>
                </div>
                <p className="text-sm text-gray-500">
                  {group.devices.length} cihaz
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}