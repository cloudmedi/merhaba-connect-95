import React, { useEffect, useState } from 'react';
import './App.css';
import { initSupabase } from '../integrations/supabase/client';
import { SystemInfo } from './types';
import { DeviceInfo } from './components/DeviceInfo';
import { TokenDisplay } from './components/TokenDisplay';
import { ErrorState } from './components/ErrorState';
import { toast } from 'sonner';

function App() {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [deviceToken, setDeviceToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const generateToken = async () => {
      try {
        const macAddress = await window.electronAPI.getMacAddress();
        if (!macAddress) {
          throw new Error('MAC adresi alınamadı');
        }

        const supabase = await initSupabase();
        const token = Math.random().toString(36).substring(2, 8).toUpperCase();
        const expirationDate = new Date();
        expirationDate.setFullYear(expirationDate.getFullYear() + 1);

        const { data, error: insertError } = await supabase
          .from('device_tokens')
          .insert({
            token,
            mac_address: macAddress,
            status: 'active',
            expires_at: expirationDate.toISOString()
          })
          .select()
          .single();

        if (insertError) {
          throw insertError;
        }

        setDeviceToken(token);
        toast.success('Token başarıyla oluşturuldu');
      } catch (error: any) {
        console.error('Token oluşturma hatası:', error);
        setError(error.message || 'Token oluşturulurken bir hata oluştu');
        toast.error('Token oluşturulamadı');
      }
    };

    generateToken();
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