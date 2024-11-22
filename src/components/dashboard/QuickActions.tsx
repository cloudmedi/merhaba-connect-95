import { Card, CardContent } from "@/components/ui/card";
import { 
  Upload, 
  PlaySquare, 
  FolderPlus,
  RefreshCw,
  Download,
  Stethoscope,
  Settings
} from "lucide-react";
import { toast } from "sonner";

export function QuickActions() {
  const handleDeviceAction = (action: string) => {
    // In a real implementation, these would connect to your device management system
    toast.info(`Initiating ${action}...`);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow bg-white border-none shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </div>
        <div className="space-y-3">
          <button 
            className="w-full flex items-center gap-3 p-3 rounded-lg bg-[#9b87f5]/10 text-[#9b87f5] hover:bg-[#9b87f5]/20 transition-colors"
            onClick={() => handleDeviceAction("device restart")}
          >
            <RefreshCw className="h-5 w-5" />
            <span className="text-sm font-medium">Restart Device</span>
          </button>
          <button 
            className="w-full flex items-center gap-3 p-3 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
            onClick={() => handleDeviceAction("firmware update")}
          >
            <Download className="h-5 w-5" />
            <span className="text-sm font-medium">Update Firmware</span>
          </button>
          <button 
            className="w-full flex items-center gap-3 p-3 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
            onClick={() => handleDeviceAction("diagnostics")}
          >
            <Stethoscope className="h-5 w-5" />
            <span className="text-sm font-medium">Run Diagnostics</span>
          </button>
          <button 
            className="w-full flex items-center gap-3 p-3 rounded-lg bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors"
            onClick={() => handleDeviceAction("configuration")}
          >
            <Settings className="h-5 w-5" />
            <span className="text-sm font-medium">Remote Configuration</span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
}