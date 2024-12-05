import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cpu, Memory, HardDrive, Network } from 'lucide-react';

interface SystemInfoProps {
  info: any;
}

export function SystemInfo({ info }: SystemInfoProps) {
  if (!info) return null;

  const formatBytes = (bytes: number) => {
    const gb = bytes / (1024 * 1024 * 1024);
    return `${gb.toFixed(2)} GB`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sistem Bilgileri</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <Cpu className="w-5 h-5 text-blue-500" />
            <div>
              <h3 className="font-medium">CPU</h3>
              <p className="text-sm text-gray-500">
                {info.cpu?.brand} ({info.cpu?.cores} çekirdek)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <Memory className="w-5 h-5 text-green-500" />
            <div>
              <h3 className="font-medium">Bellek</h3>
              <p className="text-sm text-gray-500">
                {formatBytes(info.memory?.total)} Toplam
                ({formatBytes(info.memory?.free)} Boş)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <HardDrive className="w-5 h-5 text-purple-500" />
            <div>
              <h3 className="font-medium">Disk</h3>
              <p className="text-sm text-gray-500">
                {info.disk?.[0] && formatBytes(info.disk[0].size)}
                ({info.disk?.[0] && formatBytes(info.disk[0].available)} Boş)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <Network className="w-5 h-5 text-orange-500" />
            <div>
              <h3 className="font-medium">Ağ</h3>
              <p className="text-sm text-gray-500">
                {info.network?.[0]?.ip4 || 'Bağlı değil'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}