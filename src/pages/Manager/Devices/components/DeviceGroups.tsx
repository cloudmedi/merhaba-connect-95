import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Settings, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDevices } from "../hooks/useDevices";

export function DeviceGroups() {
  const { devices } = useDevices();

  // Group devices by location and category
  const locationGroups = devices.reduce((acc, device) => {
    const location = device.location || 'Unassigned';
    if (!acc[location]) {
      acc[location] = [];
    }
    acc[location].push(device);
    return acc;
  }, {} as Record<string, typeof devices>);

  const categoryGroups = devices.reduce((acc, device) => {
    const category = device.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(device);
    return acc;
  }, {} as Record<string, typeof devices>);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-gray-500" />
            <h3 className="font-semibold text-gray-900">Location Groups</h3>
          </div>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Manage
          </Button>
        </div>
        <ScrollArea className="h-[200px]">
          <div className="space-y-4">
            {Object.entries(locationGroups).map(([location, devices]) => (
              <div key={location} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-700">{location}</p>
                  <p className="text-sm text-gray-500">{devices.length} devices</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary">
                    {devices.filter(d => d.status === 'online').length} online
                  </Badge>
                  <Badge variant="outline">
                    {devices.filter(d => d.status === 'offline').length} offline
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-gray-500" />
            <h3 className="font-semibold text-gray-900">Category Groups</h3>
          </div>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Manage
          </Button>
        </div>
        <ScrollArea className="h-[200px]">
          <div className="space-y-4">
            {Object.entries(categoryGroups).map(([category, devices]) => (
              <div key={category} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-700">{category}</p>
                  <p className="text-sm text-gray-500">{devices.length} devices</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary">
                    {devices.filter(d => d.status === 'online').length} online
                  </Badge>
                  <Badge variant="outline">
                    {devices.filter(d => d.status === 'offline').length} offline
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}