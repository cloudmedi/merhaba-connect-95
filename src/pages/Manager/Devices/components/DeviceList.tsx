import { Card } from "@/components/ui/card";

export function DeviceList() {
  return (
    <Card className="p-6">
      <div className="text-center text-muted-foreground">
        No devices found. Add a device to get started.
      </div>
    </Card>
  );
}