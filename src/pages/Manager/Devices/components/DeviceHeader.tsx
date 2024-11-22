import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

export function DeviceHeader() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">{t('devices.title')}</h1>
      <p className="text-gray-500 mt-1">{t('devices.subtitle')}</p>
      <Button className="mt-4">
        <Plus className="w-4 h-4 mr-2" />
        {t('devices.addDevice')}
      </Button>
    </div>
  );
}