import React from 'react';
import { SystemInfo } from '../types';

interface DeviceInfoProps {
  systemInfo: SystemInfo;
}

function formatBytes(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${Math.round(bytes / Math.pow(1024, i))} ${sizes[i]}`;
}

export function DeviceInfo({ systemInfo }: DeviceInfoProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Sistem Bilgileri</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">CPU</h3>
          <div className="space-y-2">
            <p><span className="font-medium">Üretici:</span> {systemInfo.cpu.manufacturer}</p>
            <p><span className="font-medium">Model:</span> {systemInfo.cpu.brand}</p>
            <p><span className="font-medium">Hız:</span> {systemInfo.cpu.speed} GHz</p>
            <p><span className="font-medium">Çekirdek:</span> {systemInfo.cpu.cores}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Bellek</h3>
          <div className="space-y-2">
            <p><span className="font-medium">Toplam:</span> {formatBytes(systemInfo.memory.total)}</p>
            <p><span className="font-medium">Kullanılan:</span> {formatBytes(systemInfo.memory.used)}</p>
            <p><span className="font-medium">Boş:</span> {formatBytes(systemInfo.memory.free)}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">İşletim Sistemi</h3>
          <div className="space-y-2">
            <p><span className="font-medium">Platform:</span> {systemInfo.os.platform}</p>
            <p><span className="font-medium">Dağıtım:</span> {systemInfo.os.distro}</p>
            <p><span className="font-medium">Sürüm:</span> {systemInfo.os.release}</p>
            <p><span className="font-medium">Mimari:</span> {systemInfo.os.arch}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Ağ</h3>
          <div className="space-y-4">
            {systemInfo.network.map((net, index) => (
              <div key={index} className="border-b pb-2 last:border-0">
                <p><span className="font-medium">Arayüz:</span> {net.iface}</p>
                <p><span className="font-medium">IP:</span> {net.ip4}</p>
                <p><span className="font-medium">MAC:</span> {net.mac}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}