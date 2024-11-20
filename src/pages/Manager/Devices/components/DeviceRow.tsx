import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Power, RefreshCw, Clock, Edit, Trash2, ArrowUpDown } from "lucide-react";
import { DeviceScheduleDialog } from "./DeviceScheduleDialog";
import { useState } from "react";
import { toast } from "sonner";
import { EditDeviceDialog } from "./EditDeviceDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

interface DeviceProps {
  device: {
    id: string;
    branchName: string;
    location: string;
    category: string;
    status: string;
    ip: string;
    lastSeen: string;
    systemInfo: {
      os: string;
      memory: string;
      storage: string;
      version: string;
    };
    schedule: {
      powerOn: string;
      powerOff: string;
    };
  };
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  sortConfig: {
    key: string;
    direction: 'asc' | 'desc';
  };
  onSort: (key: string) => void;
}

export function DeviceRow({ device, isSelected, onSelect, sortConfig, onSort }: DeviceProps) {
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleReset = () => {
    toast.success("Device reset command sent");
  };

  const handleDelete = () => {
    toast.success("Device deleted successfully");
  };

  const SortButton = ({ column }: { column: string }) => (
    <Button
      variant="ghost"
      onClick={() => onSort(column)}
      className="h-8 w-8 p-0 hover:bg-gray-100"
    >
      <ArrowUpDown className="h-4 w-4" />
    </Button>
  );

  return (
    <Card className="hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm border-none">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={isSelected}
                onCheckedChange={onSelect}
                className="mr-2"
              />
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
              <div className="flex items-center gap-1">
                <h3 className="font-semibold text-lg">{device.branchName}</h3>
                <SortButton column="branchName" />
              </div>
              <span className="text-sm text-gray-500">({device.location})</span>
              <SortButton column="location" />
            </div>
            
            <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Category:</span>
                <span className="capitalize">{device.category}</span>
                <SortButton column="category" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">IP:</span>
                <span>{device.ip}</span>
                <SortButton column="ip" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Last Seen:</span>
                <span>{device.lastSeen}</span>
                <SortButton column="lastSeen" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Version:</span>
                <span>{device.systemInfo.version}</span>
                <SortButton column="version" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowScheduleDialog(true)}
              className="hover:bg-gray-100"
            >
              <Clock className="h-4 w-4 text-gray-600" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleReset}
              className="hover:bg-gray-100"
            >
              <RefreshCw className="h-4 w-4 text-gray-600" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => toast.success("Power command sent")}
              className="hover:bg-gray-100"
            >
              <Power className="h-4 w-4 text-gray-600" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowEditDialog(true)}
              className="hover:bg-gray-100"
            >
              <Edit className="h-4 w-4 text-gray-600" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Device</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this device? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      <DeviceScheduleDialog
        open={showScheduleDialog}
        onOpenChange={setShowScheduleDialog}
        device={device}
      />
      <EditDeviceDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        device={device}
      />
    </Card>
  );
}