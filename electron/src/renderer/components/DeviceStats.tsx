import React from 'react';
import { Card } from './ui/card';
import { Activity, Signal, AlertTriangle, HardDrive } from 'lucide-react';

interface DeviceStatsProps {
  systemInfo: any;
  deviceStatus: 'online' | 'offline';
}

export function DeviceStats({ systemInfo, deviceStatus }: DeviceStatsProps) {
  // Örnek uyarı durumu kontrolü - CPU veya RAM kullanımı yüksekse
  const hasWarning = systemInfo?.cpu?.usage > 80 || systemInfo?.memory?.usedMemPercentage > 80;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="p-6 hover:shadow-md transition-all duration-200 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Cihaz Durumu</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">1</h3>
            <p className="text-xs text-emerald-600 mt-1">Toplam Cihaz</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-full">
            <HardDrive className="h-6 w-6 text-purple-600" />
          </div>
        </div>
      </Card>

      <Card className="p-6 hover:shadow-md transition-all duration-200 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Bağlantı</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">
              {deviceStatus === 'online' ? 'Çevrimiçi' : 'Çevrimdışı'}
            </h3>
            <p className="text-xs text-emerald-600 mt-1">
              {deviceStatus === 'online' ? 'Aktif Bağlantı' : 'Bağlantı Yok'}
            </p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-full">
            <Signal className="h-6 w-6 text-emerald-600" />
          </div>
        </div>
      </Card>

      <Card className="p-6 hover:shadow-md transition-all duration-200 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Sistem Durumu</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">
              {hasWarning ? 'Uyarı' : 'Normal'}
            </h3>
            <p className="text-xs text-emerald-600 mt-1">
              {hasWarning ? 'Dikkat Gerekiyor' : 'Sistem Sağlıklı'}
            </p>
          </div>
          <div className="p-3 bg-blue-50 rounded-full">
            <Activity className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </Card>

      <Card className="p-6 hover:shadow-md transition-all duration-200 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Uyarılar</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">
              {hasWarning ? '1' : '0'}
            </h3>
            <p className="text-xs text-red-600 mt-1">
              {hasWarning ? 'Aktif Uyarı' : 'Uyarı Yok'}
            </p>
          </div>
          <div className="p-3 bg-amber-50 rounded-full">
            <AlertTriangle className="h-6 w-6 text-amber-600" />
          </div>
        </div>
      </Card>
    </div>
  );
}