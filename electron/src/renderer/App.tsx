import React, { useEffect, useState } from 'react';
import './App.css';
import { initSupabase } from '../integrations/supabase/client';
import { createDeviceToken } from '../integrations/supabase/deviceToken';
import { TokenDisplay } from './components/TokenDisplay';

function App() {
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

        // Get or create token
        const tokenData = await createDeviceToken(macAddress);
        if (tokenData?.token) {
          setDeviceToken(tokenData.token);
        }

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
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <TokenDisplay token={deviceToken} />
      </div>
    </div>
  );
}

export default App;