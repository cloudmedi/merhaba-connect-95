import React, { useEffect, useState } from 'react';
import './App.css';
import { initSupabase } from '../integrations/supabase/client';
import { createDeviceToken } from '../integrations/supabase/deviceToken';
import { SystemInfo } from './types';
import { DeviceInfo } from './components/DeviceInfo';
import { TokenDisplay } from './components/TokenDisplay';
import { ErrorState } from './components/ErrorState';
import { LoadingState } from './components/LoadingState';

function App() {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [deviceToken, setDeviceToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Initialize Supabase
        await initSupabase();
        
        // Get MAC address
        const macAddress = await window.electronAPI.getMacAddress();
        console.log('MAC Address:', macAddress);
        
        if (!macAddress) {
          throw new Error('MAC adresi alınamadı');
        }

        // Get or create token for this MAC address
        const tokenData = await createDeviceToken(macAddress);
        console.log('Token Data:', tokenData);
        
        if (tokenData?.token) {
          setDeviceToken(tokenData.token);
        }

        // Get system info
        const sysInfo = await window.electronAPI.getSystemInfo();
        setSystemInfo(sysInfo);

        setIsLoading(false);
      } catch (error: any) {
        console.error('Initialization error:', error);
        setError(error.message || 'Bir hata oluştu');
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  if (error) {
    return <ErrorState error={error} onRetry={() => window.location.reload()} />;
  }

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <TokenDisplay token={deviceToken} />
        {systemInfo && <DeviceInfo systemInfo={systemInfo} />}
      </div>
    </div>
  );
}

export default App;