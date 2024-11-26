import React, { useEffect, useState } from 'react';
import './App.css';
import { initSupabase } from '../integrations/supabase/client';
import { createDeviceToken } from '../integrations/supabase/deviceToken';
import { SystemInfo } from './types';
import { DeviceInfo } from './components/DeviceInfo';
import { TokenDisplay } from './components/TokenDisplay';
import { ErrorState } from './components/ErrorState';
import { LoadingState } from './components/LoadingState';
import { DeviceStats } from './components/DeviceStats';

function App() {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [deviceToken, setDeviceToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [deviceStatus, setDeviceStatus] = useState<'online' | 'offline'>('offline');

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
          throw new Error('Could not get MAC address');
        }

        // Get or create token for this MAC address
        const tokenData = await createDeviceToken(macAddress);
        if (tokenData?.token) {
          setDeviceToken(tokenData.token);
          setDeviceStatus('online');
        }

        setIsLoading(false);
      } catch (error: any) {
        console.error('Initialization error:', error);
        setError(error.message || 'An error occurred');
        setDeviceStatus('offline');
        setIsLoading(false);
      }
    };

    initialize();
    
    // Set up system info listeners
    window.electronAPI.getSystemInfo().then(setSystemInfo);
    window.electronAPI.onSystemInfoUpdate(setSystemInfo);

    // Cleanup function
    return () => {
      setDeviceStatus('offline');
    };
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
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <TokenDisplay token={deviceToken} />
        <DeviceStats systemInfo={systemInfo} deviceStatus={deviceStatus} />
        {systemInfo && <DeviceInfo systemInfo={systemInfo} />}
      </div>
    </div>
  );
}

export default App;