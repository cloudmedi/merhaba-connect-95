import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function DeviceHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Devices</h1>
        <p className="text-sm text-muted-foreground">
          Manage and monitor your connected devices
        </p>
      </div>
      <Button>
        <Plus className="mr-2 h-4 w-4" />
        Add Device
      </Button>
    </div>
  );
}