import { Card } from "@/components/ui/card";
import { Activity, Signal, AlertTriangle, HardDrive } from "lucide-react";
import { useDevices } from "../hooks/useDevices";
import { useTranslation } from "react-i18next";

export function DeviceStats() {
  const { devices } = useDevices();
  const { t } = useTranslation();
  
  const stats = {
    total: devices.length,
    online: devices.filter(d => d.status === 'online').length,
    offline: devices.filter(d => d.status === 'offline').length,
    warning: devices.filter(d => d.system_info.health === 'warning').length
  };

  const healthPercentage = ((stats.online / stats.total) * 100) || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="p-4 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{t('devices.totalDevices')}</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</h3>
          </div>
          <div className="p-3 bg-blue-100 rounded-full">
            <HardDrive className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </Card>

      <Card className="p-4 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{t('devices.onlineDevices')}</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.online}</h3>
            <p className="text-xs text-emerald-600 mt-1">
              {Math.round(healthPercentage)}% {t('devices.operational')}
            </p>
          </div>
          <div className="p-3 bg-emerald-100 rounded-full">
            <Signal className="h-6 w-6 text-emerald-600" />
          </div>
        </div>
      </Card>

      <Card className="p-4 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{t('devices.offlineDevices')}</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.offline}</h3>
          </div>
          <div className="p-3 bg-gray-100 rounded-full">
            <Activity className="h-6 w-6 text-gray-600" />
          </div>
        </div>
      </Card>

      <Card className="p-4 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{t('devices.warnings')}</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.warning}</h3>
          </div>
          <div className="p-3 bg-yellow-100 rounded-full">
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
          </div>
        </div>
      </Card>
    </div>
  );
}