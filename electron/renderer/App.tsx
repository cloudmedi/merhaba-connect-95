import { useState } from 'react';

export function App() {
  const [deviceId, setDeviceId] = useState<string | null>(null);

  const handleRegister = async () => {
    try {
      const deviceInfo = {
        id: crypto.randomUUID(),
        name: 'Offline Player',
        type: 'desktop'
      };
      
      const result = await window.electronAPI.registerDevice(deviceInfo);
      setDeviceId(result.deviceId);
    } catch (error) {
      console.error('Error registering device:', error);
    }
  };

  return (
    <div className="container p-4">
      <h1 className="text-2xl font-bold mb-4">Offline Music Player</h1>
      
      {!deviceId ? (
        <button 
          onClick={handleRegister}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Register Device
        </button>
      ) : (
        <div>
          <p>Device ID: {deviceId}</p>
        </div>
      )}
    </div>
  );
}