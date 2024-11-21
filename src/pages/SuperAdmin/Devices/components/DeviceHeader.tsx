import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export function DeviceHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">All Devices</h2>
        <p className="text-muted-foreground">
          Manage and monitor all devices across companies
        </p>
      </div>
      <div className="flex gap-2">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Device
        </Button>
      </div>
    </div>
  );
}