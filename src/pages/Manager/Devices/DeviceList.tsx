import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function DeviceList() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Devices</h1>
        <Button 
          onClick={() => navigate("/manager/devices/new")}
          className="bg-[#6E59A5] hover:bg-[#5B4A8A]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Device
        </Button>
      </div>
      
      {/* Device list will be implemented here */}
      <div className="text-gray-500">Device list coming soon...</div>
    </div>
  );
}