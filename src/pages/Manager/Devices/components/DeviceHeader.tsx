import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { NewDeviceDialog } from "./NewDeviceDialog";

export function DeviceHeader() {
  const { t } = useTranslation();
  const [showNewDeviceDialog, setShowNewDeviceDialog] = useState(false);
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">{t('devices.title')}</h1>
      <p className="text-gray-500 mt-1">{t('devices.subtitle')}</p>
      <Button 
        className="mt-4"
        onClick={() => setShowNewDeviceDialog(true)}
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