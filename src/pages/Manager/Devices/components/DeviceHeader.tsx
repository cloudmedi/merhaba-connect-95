import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { NewDeviceDialog } from "./NewDeviceDialog";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export function DeviceHeader() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showNewDeviceDialog, setShowNewDeviceDialog] = useState(false);
  
  if (!user) {
    navigate("/manager/login");
    return null;
  }

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('devices.title')}</h1>
        <p className="text-gray-500 mt-1">{t('devices.subtitle')}</p>
      </div>
      
      <Button 
        onClick={() => setShowNewDeviceDialog(true)}
        className="bg-[#6E59A5] hover:bg-[#5B4A8A] text-white"
      >
        <Plus className="w-4 h-4 mr-2" />
        {t('devices.addDevice')}
      </Button>

      <NewDeviceDialog 
        open={showNewDeviceDialog} 
        onOpenChange={setShowNewDeviceDialog} 
      />
    </div>
  );
}