import { useParams } from "react-router-dom";

export function DeviceDetail() {
  const { deviceId } = useParams();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Device Details</h1>
      <div className="text-gray-500">Device ID: {deviceId}</div>
      {/* Device details will be implemented here */}
    </div>
  );
}