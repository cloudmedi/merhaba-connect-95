import { Device } from "../hooks/types";
import { DeviceListItem } from "./DeviceListItem";

interface DeviceListProps {
  devices: Device[];
}

export function DeviceList({ devices }: DeviceListProps) {
  if (devices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-gray-500 mb-2">No devices found</p>
        <p className="text-sm text-gray-400">Add a new device to get started</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
      {devices.map((device) => (
        <DeviceListItem key={device.id} device={device} />
      ))}
    </div>
  );
}