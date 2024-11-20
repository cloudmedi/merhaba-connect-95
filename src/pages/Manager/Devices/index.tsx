import { DeviceList } from "./components/DeviceList";
import { DeviceHeader } from "./components/DeviceHeader";

export default function Devices() {
  return (
    <div className="space-y-6">
      <DeviceHeader />
      <DeviceList />
    </div>
  );
}