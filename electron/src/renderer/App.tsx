import React, { useEffect, useState } from 'react';
import './App.css';
import { initSupabase } from '../integrations/supabase/client';
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
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const initialize = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const supabase = await initSupabase();
        const macAddress = await window.electronAPI.getMacAddress();
        
        const { data: existingToken, error: tokenError } = await supabase
          .from('device_tokens')
          .select('token')
          .eq('device_id', macAddress)
          .eq('status', 'active')
          .maybeSingle();

        if (tokenError) throw tokenError;

        if (existingToken) {
          setDeviceToken(existingToken.token);
        } else {
          const newToken = Math.random().toString(36).substring(2, 8).toUpperCase();
          const expirationDate = new Date();
          expirationDate.setFullYear(expirationDate.getFullYear() + 1);

          const { error: insertError } = await supabase
            .from('device_tokens')
            .insert({
              token: newToken,
              device_id: macAddress,
              expires_at: expirationDate.toISOString()
            });

          if (insertError) throw insertError;
          setDeviceToken(newToken);
        }

        setIsLoading(false);
      } catch (error: any) {
        console.error('Initialization error:', error);
        setError(error.message);
        setIsLoading(false);
      }
    };

    initialize();
    
    window.electronAPI.getSystemInfo().then(setSystemInfo);
    window.electronAPI.onSystemInfoUpdate(setSystemInfo);
  }, [retryCount]);

  if (error) {
    return <ErrorState error={error} onRetry={() => setRetryCount(prev => prev + 1)} />;
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