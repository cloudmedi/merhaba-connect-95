import React from 'react';
import type { SystemInfo } from '../../types/electron';
import { Card, CardContent, CardHeader, CardTitle } from '@ui/card';
import { Cpu, HardDrive, Database, Network, Server } from 'lucide-react';

interface DeviceInfoProps {
  systemInfo: SystemInfo;
}

export function DeviceInfo({ systemInfo }: DeviceInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="w-5 h-5" />
          System Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="flex items-center gap-2 font-medium">
            <Cpu className="w-4 h-4" />
            CPU
          </h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p>Manufacturer: {systemInfo.cpu.manufacturer}</p>
            <p>Brand: {systemInfo.cpu.brand}</p>
            <p>Speed: {systemInfo.cpu.speed} GHz</p>
            <p>Cores: {systemInfo.cpu.cores}</p>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="flex items-center gap-2 font-medium">
            <Database className="w-4 h-4" />
            Memory
          </h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p>Total: {Math.round(systemInfo.memory.total / 1024 / 1024 / 1024)} GB</p>
            <p>Free: {Math.round(systemInfo.memory.free / 1024 / 1024 / 1024)} GB</p>
            <p>Used: {Math.round(systemInfo.memory.used / 1024 / 1024 / 1024)} GB</p>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="flex items-center gap-2 font-medium">
            <HardDrive className="w-4 h-4" />
            Storage
          </h3>
          <div className="text-sm text-gray-600 space-y-1">
            {systemInfo.disk.map((disk, index) => (
              <div key={index} className="border-b pb-2 last:border-0 last:pb-0">
                <p>Filesystem: {disk.fs}</p>
                <p>Size: {Math.round(disk.size / 1024 / 1024 / 1024)} GB</p>
                <p>Used: {Math.round(disk.used / 1024 / 1024 / 1024)} GB</p>
                <p>Available: {Math.round(disk.available / 1024 / 1024 / 1024)} GB</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="flex items-center gap-2 font-medium">
            <Network className="w-4 h-4" />
            Network
          </h3>
          <div className="text-sm text-gray-600 space-y-1">
            {systemInfo.network.map((net: { iface: string; ip4: string; mac: string }, index: number) => (
              <div key={index} className="border-b pb-2 last:border-0 last:pb-0">
                <p>Interface: {net.iface}</p>
                <p>IPv4: {net.ip4}</p>
                <p>MAC: {net.mac}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}