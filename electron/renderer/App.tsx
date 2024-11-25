import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Computer, Music2 } from 'lucide-react';

export function App() {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if device is already registered
    window.electronAPI.getDeviceId()
      .then((id) => {
        if (id) {
          setDeviceId(id);
        }
        setIsLoading(false);
      })
      .catch(console.error);
  }, []);

  const handleRegister = async () => {
    try {
      const deviceInfo = {
        id: crypto.randomUUID(),
        name: 'Offline Player',
        type: 'desktop'
      };
      
      const result = await window.electronAPI.registerDevice(deviceInfo);
      setDeviceId(result.deviceId);
    } catch (error) {
      console.error('Error registering device:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Music2 className="w-8 h-8" />
            Offline Music Player
          </h1>
        </div>

        {!deviceId ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Computer className="w-5 h-5" />
                Device Registration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                To start using the offline music player, you need to register this device.
              </p>
              <Button 
                onClick={handleRegister}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                Register Device
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Device Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Device ID: {deviceId}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Sync Status</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Last synced: Never</p>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Available Playlists</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">No playlists available. Sync to download playlists.</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}