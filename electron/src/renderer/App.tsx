import React, { useEffect, useState } from 'react';
import './App.css';
import { initSupabase } from '../integrations/supabase/client';
import { SystemInfo } from './types';
import { DeviceInfo } from './components/DeviceInfo';
import { TokenDisplay } from './components/TokenDisplay';
import { ErrorState } from './components/ErrorState';

function App() {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [deviceToken, setDeviceToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const initialize = async () => {
      try {
        setError(null);
        const macAddress = await window.electronAPI.getMacAddress();
        if (!macAddress) {
          throw new Error('Could not get MAC address');
        }

        const supabase = await initSupabase();
        const { data: existingToken } = await supabase
          .from('device_tokens')
          .select('token')
          .eq('mac_address', macAddress)
          .eq('status', 'active')
          .maybeSingle();

        if (existingToken?.token) {
          setDeviceToken(existingToken.token);
          return;
        }

        const token = Math.random().toString(36).substring(2, 8).toUpperCase();
        const expirationDate = new Date();
        expirationDate.setFullYear(expirationDate.getFullYear() + 1);

        await supabase
          .from('device_tokens')
          .insert({
            token,
            mac_address: macAddress,
            status: 'active',
            expires_at: expirationDate.toISOString()
          });

        setDeviceToken(token);
      } catch (error: any) {
        console.error('Initialization error:', error);
        setError(error.message || 'An error occurred');
      }
    };

    initialize();
    window.electronAPI.getSystemInfo().then(setSystemInfo);
    window.electronAPI.onSystemInfoUpdate(setSystemInfo);
  }, [retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  if (error) {
    return <ErrorState error={error} onRetry={handleRetry} />;
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