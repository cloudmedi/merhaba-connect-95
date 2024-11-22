import { Card } from "@/components/ui/card";
import { useDevices } from "../hooks/useDevices";
import { MapPin, Navigation } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export function DeviceMaps() {
  const { devices } = useDevices();

  // Group devices by location
  const locationGroups = devices.reduce((acc, device) => {
    const location = device.location || 'Unassigned';
    if (!acc[location]) {
      acc[location] = [];
    }
    acc[location].push(device);
    return acc;
  }, {} as Record<string, typeof devices>);

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Navigation className="h-5 w-5 text-gray-500" />
          <h3 className="font-semibold text-gray-900">Device Maps</h3>
        </div>
      </div>
      <ScrollArea className="h-[200px]">
        <div className="space-y-4">
          {Object.entries(locationGroups).map(([location, devices]) => (
            <div key={location} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-700">{location}</p>
                  <p className="text-sm text-gray-500">{devices.length} devices</p>
                </div>
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
  );
}