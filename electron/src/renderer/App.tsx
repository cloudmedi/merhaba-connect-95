import React, { useEffect, useState } from 'react';
import './App.css';
import { initSupabase } from '../integrations/supabase/client';
import { createDeviceToken } from '../integrations/supabase/deviceToken';
import { SystemInfo } from './types';
import { DeviceInfo } from './components/DeviceInfo';
import { TokenDisplay } from './components/TokenDisplay';
import { ErrorState } from './components/ErrorState';
import { LoadingState } from './components/LoadingState';
import { Toaster } from 'sonner';

function App() {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [deviceToken, setDeviceToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const initialize = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Initialize Supabase
        await initSupabase();
        
        // Get MAC address
        const macAddress = await window.electronAPI.getMacAddress();
        
        if (!macAddress) {
          throw new Error('MAC adresi alınamadı');
        }

        // Get or create token for this MAC address
        const tokenData = await createDeviceToken(macAddress);
        if (tokenData?.token) {
          setDeviceToken(tokenData.token);
        }

        // Get initial system info
        const info = await window.electronAPI.getSystemInfo();
        setSystemInfo(info);

        setIsLoading(false);
      } catch (error: any) {
        console.error('Başlatma hatası:', error);
        setError(error.message || 'Bir hata oluştu');
        setIsLoading(false);
      }
    };

    initialize();
  }, [retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  if (error) {
    return <ErrorState error={error} onRetry={handleRetry} />;
  }

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <TokenDisplay token={deviceToken} />
        {systemInfo && <DeviceInfo systemInfo={systemInfo} />}
      </div>
      <Toaster />
    </div>
  );
}

export default App;