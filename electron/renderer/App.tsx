import { useState, useEffect } from 'react';

export function App() {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.electronAPI.getDeviceId()
      .then((id) => {
        if (id) {
          setDeviceId(id);
        }
        setIsLoading(false);
      })
      .catch(console.error);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900">
          Offline Music Player
        </h1>
        {deviceId ? (
          <p className="mt-4 text-gray-600">Device ID: {deviceId}</p>
        ) : (
          <p className="mt-4 text-gray-600">No device registered</p>
        )}
      </div>
    </div>
  );
}