import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { HardDrive, Server, Database, Network } from 'lucide-react';

interface SystemInfoProps {
  info: any;
}

export function SystemInfo({ info }: SystemInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <Server className="w-6 h-6 mr-2" />
            <div>
              <h3 className="font-medium">CPU</h3>
              <p>{info.cpu.manufacturer} {info.cpu.brand}</p>
              <p>{info.cpu.cores} cores at {info.cpu.speed} GHz</p>
            </div>
          </div>
          <div className="flex items-center">
            <HardDrive className="w-6 h-6 mr-2" />
            <div>
              <h3 className="font-medium">Memory</h3>
              <p>{info.memory.total} GB Total</p>
              <p>{info.memory.used} GB Used</p>
              <p>{info.memory.free} GB Free</p>
            </div>
          </div>
          <div className="flex items-center">
            <Database className="w-6 h-6 mr-2" />
            <div>
              <h3 className="font-medium">OS</h3>
              <p>{info.os.platform} {info.os.distro} {info.os.release} ({info.os.arch})</p>
            </div>
          </div>
          <div className="flex items-center">
            <Network className="w-6 h-6 mr-2" />
            <div>
              <h3 className="font-medium">Network</h3>
              {info.network.map((net: any, index: number) => (
                <p key={index}>{net.iface}: {net.ip4} (MAC: {net.mac})</p>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}