import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Device, Download, Music } from "lucide-react";
import { toast } from "sonner";

declare global {
  interface Window {
    electronAPI: {
      registerDevice: (deviceInfo: any) => Promise<any>;
      getDeviceId: () => Promise<string>;
      onSyncStatusChange: (callback: (status: string) => void) => void;
    };
  }
}

export function OfflinePlayerApp() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string>('idle');

  useEffect(() => {
    // Check if device is already registered
    window.electronAPI.getDeviceId()
      .then((deviceId) => {
        if (deviceId) {
          setIsRegistered(true);
        }
      })
      .catch(console.error);

    // Listen for sync status changes
    window.electronAPI.onSyncStatusChange((status) => {
      setSyncStatus(status);
      if (status === 'completed') {
        toast.success('Sync completed successfully');
      } else if (status === 'error') {
        toast.error('Sync failed');
      }
    });
  }, []);

  const handleRegister = async () => {
    try {
      const deviceInfo = {
        id: crypto.randomUUID(),
        name: 'Offline Player',
        type: 'desktop'
      };

      await window.electronAPI.registerDevice(deviceInfo);
      setIsRegistered(true);
      toast.success('Device registered successfully');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Failed to register device');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Device className="w-6 h-6" />
            Offline Player
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isRegistered ? (
            <div className="text-center">
              <Button onClick={handleRegister}>
                Register Device
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Music className="w-4 h-4 text-gray-500" />
                      <span>Playlists</span>
                    </div>
                    <p className="text-2xl font-bold mt-2">0</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Download className="w-4 h-4 text-gray-500" />
                      <span>Sync Status</span>
                    </div>
                    <p className="text-2xl font-bold mt-2 capitalize">{syncStatus}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}