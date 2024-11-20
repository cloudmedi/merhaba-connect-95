import { Card } from "@/components/ui/card";
import { DeviceRow } from "./DeviceRow";

// Mock data for demonstration
const mockDevices = [
  {
    id: "1",
    branchName: "Main Branch",
    status: "online",
    ip: "192.168.1.100",
    lastSeen: "2024-03-20T10:00:00",
    systemInfo: {
      os: "Linux 5.15.0",
      memory: "4GB",
      storage: "64GB",
      version: "1.2.0",
    },
    schedule: {
      powerOn: "08:00",
      powerOff: "22:00",
    },
  },
];

export function DeviceList() {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        {mockDevices.map((device) => (
          <DeviceRow key={device.id} device={device} />
        ))}
      </div>
    </Card>
  );
}