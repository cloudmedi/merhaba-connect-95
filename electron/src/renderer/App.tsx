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
        
        // Supabase'i başlat
        const supabase = await initSupabase();
        console.log('Supabase initialized successfully');
        
        // MAC adresini al
        const macAddress = await window.electronAPI.getMacAddress();
        console.log('MAC address obtained:', macAddress);
        
        if (!macAddress) {
          throw new Error('MAC adresi alınamadı');
        }

        // Mevcut token'ı kontrol et
        const { data: existingToken, error: tokenError } = await supabase
          .from('device_tokens')
          .select('token, status')
          .eq('device_id', macAddress)
          .eq('status', 'active')
          .maybeSingle();

        if (tokenError) {
          console.error('Token query error:', tokenError);
          throw tokenError;
        }

        if (existingToken?.token) {
          console.log('Existing token found:', existingToken.token);
          setDeviceToken(existingToken.token);
        } else {
          // Yeni token oluştur
          const newToken = Math.random().toString(36).substring(2, 8).toUpperCase();
          console.log('Generating new token:', newToken);
          
          const expirationDate = new Date();
          expirationDate.setFullYear(expirationDate.getFullYear() + 1);

          const { error: insertError } = await supabase
            .from('device_tokens')
            .insert({
              token: newToken,
              device_id: macAddress,
              status: 'active',
              expires_at: expirationDate.toISOString()
            });

          if (insertError) {
            console.error('Token insert error:', insertError);
            throw insertError;
          }

          setDeviceToken(newToken);
        }

        setIsLoading(false);
      } catch (error: any) {
        console.error('Initialization error:', error);
        setError(error.message || 'Bir hata oluştu');
        setIsLoading(false);
      }
    };

    initialize();
    
    // Sistem bilgisi dinleyicilerini ayarla
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