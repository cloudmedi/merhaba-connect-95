import React, { useEffect, useState } from 'react';
import './App.css';
import { createDeviceToken } from '../utils/deviceToken';
import { TokenDisplay } from './components/TokenDisplay';
import type { SystemInfo } from '../types/electron';
import { PlaylistSync } from './components/PlaylistSync';
import { LoadingState } from './components/LoadingState';
import { toast } from 'sonner';
import { DeviceInfo } from './components/DeviceInfo';

function App() {
  const [deviceToken, setDeviceToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const macAddress = await window.electronAPI.getMacAddress();
        console.log('MAC Address:', macAddress);
        
        if (!macAddress) {
          throw new Error('MAC adresi alınamadı');
        }

        const sysInfo = await window.electronAPI.getSystemInfo();
        setSystemInfo(sysInfo);
        console.log('System Info:', sysInfo);

        const tokenData = await createDeviceToken(macAddress);
        if (tokenData && tokenData.token) {
          setDeviceToken(tokenData.token);
          await window.electronAPI.registerDevice({ token: tokenData.token });
          toast.success('Cihaz başarıyla kaydedildi');
        } else {
          throw new Error('Invalid token data received');
        }

        setIsLoading(false);
      } catch (error: any) {
        console.error('Initialization error:', error);
        setError(error.message || 'Bir hata oluştu');
        toast.error('Cihaz kaydı başarısız: ' + error.message);
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-red-600 text-xl mb-4">Hata</h2>
          <p className="text-gray-700">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <TokenDisplay token={deviceToken} />
        {systemInfo && <DeviceInfo systemInfo={systemInfo} />}
        <PlaylistSync />
      </div>
    </div>
  );
}

export default App;