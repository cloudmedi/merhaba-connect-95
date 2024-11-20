import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Power, RefreshCw, Clock, Edit, Trash2 } from "lucide-react";
import { DeviceScheduleDialog } from "./DeviceScheduleDialog";
import { useState } from "react";
import { toast } from "sonner";
import { EditDeviceDialog } from "./EditDeviceDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface DeviceProps {
  device: {
    id: string;
    branchName: string;
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
}

export function DeviceRow({ device }: DeviceProps) {
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleReset = () => {
    toast.success("Device reset command sent");
  };

  const handleDelete = () => {
    toast.success("Device deleted successfully");
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div
                className={`h-3 w-3 rounded-full ${
                  device.status === "online" ? "bg-green-500" : "bg-gray-300"
                }`}
              />
              <h3 className="font-semibold">{device.branchName}</h3>
            </div>
            <p className="text-sm text-muted-foreground">IP: {device.ip}</p>
            <div className="text-sm text-muted-foreground">
              <p>OS: {device.systemInfo.os}</p>
              <p>Memory: {device.systemInfo.memory}</p>
              <p>Storage: {device.systemInfo.storage}</p>
              <p>Version: {device.systemInfo.version}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Schedule: {device.schedule.powerOn} - {device.schedule.powerOff}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowScheduleDialog(true)}
            >
              <Clock className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleReset}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => toast.success("Power command sent")}
            >
              <Power className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowEditDialog(true)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="icon">
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
      </CardContent>
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