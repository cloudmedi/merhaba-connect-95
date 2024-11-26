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
        
        console.log('Starting initialization...');
        
        // Initialize Supabase
        const supabase = await initSupabase();
        console.log('Supabase initialized successfully');
        
        // Get MAC address
        const macAddress = await window.electronAPI.getMacAddress();
        console.log('MAC Address:', macAddress);
        
        if (!macAddress) {
          throw new Error('Could not get MAC address');
        }

        // Get active token for this MAC address
        const { data: activeToken, error: tokenError } = await supabase
          .from('device_tokens')
          .select('token')
          .eq('mac_address', macAddress)
          .eq('status', 'active')
          .maybeSingle();

        if (tokenError) {
          console.error('Token query error:', tokenError);
          throw tokenError;
        }

        if (activeToken?.token) {
          setDeviceToken(activeToken.token);
        }

        setIsLoading(false);
      } catch (error: any) {
        console.error('Initialization error:', error);
        setError(error.message || 'An error occurred');
        setIsLoading(false);
      }
    };

    initialize();
    
    // Set up system info listeners
    window.electronAPI.getSystemInfo().then(setSystemInfo);
    window.electronAPI.onSystemInfoUpdate(setSystemInfo);
  }, [retryCount]);

  const handleRetry = () => {
    console.log('Retrying initialization...');
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
        {systemInfo && <DeviceInfo systemInfo={systemInfo} />}
      </div>
    </div>
  );
}

export default App;