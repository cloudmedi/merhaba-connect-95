import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings, Power, RefreshCw, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Device } from "../hooks/types";
import { useDevices } from "../hooks/useDevices";
import { toast } from "sonner";

interface DeviceListItemProps {
  device: Device;
}

export function DeviceListItem({ device }: DeviceListItemProps) {
  const { updateDevice, deleteDevice } = useDevices();

  const handlePowerToggle = async () => {
    try {
      await updateDevice.mutateAsync({
        id: device.id,
        status: device.status === 'online' ? 'offline' : 'online'
      });
      toast.success(`Device ${device.status === 'online' ? 'powered off' : 'powered on'}`);
    } catch (error) {
      toast.error('Failed to toggle device power');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDevice.mutateAsync(device.id);
      toast.success('Device deleted successfully');
    } catch (error) {
      toast.error('Failed to delete device');
    }
  };

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow duration-300 bg-white/80 backdrop-blur-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg text-gray-900">{device.name}</h3>
          <p className="text-sm text-gray-500">{device.location || 'No location set'}</p>
        </div>
        <Badge 
          variant={device.status === "online" ? "default" : "secondary"}
          className={`${
            device.status === "online" 
              ? "bg-green-500/10 text-green-500 hover:bg-green-500/20" 
              : "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
          }`}
        >
          {device.status === "online" ? "Online" : "Offline"}
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
        <div>
          <span className="text-gray-400">Type:</span>
          <span className="ml-2 capitalize">{device.category}</span>
        </div>
        <div>
          <span className="text-gray-400">IP:</span>
          <span className="ml-2">{device.ip_address || 'N/A'}</span>
        </div>
        <div>
          <span className="text-gray-400">Last Seen:</span>
          <span className="ml-2">{device.last_seen ? new Date(device.last_seen).toLocaleString() : 'Never'}</span>
        </div>
        <div>
          <span className="text-gray-400">Version:</span>
          <span className="ml-2">{device.system_info.version || 'N/A'}</span>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePowerToggle}
          className="hover:bg-gray-100"
        >
          <Power className="h-4 w-4 text-gray-600" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => updateDevice.mutateAsync({ id: device.id, status: 'offline' })}
          className="hover:bg-gray-100"
        >
          <RefreshCw className="h-4 w-4 text-gray-600" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="hover:bg-gray-100">
              <Settings className="h-4 w-4 text-gray-600" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleDelete} className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Device
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}