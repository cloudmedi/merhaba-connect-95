import { useEffect, useState } from 'react';
import { Card } from './components/ui/card';
import { Button } from './components/ui/button';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { PlaylistPlayer } from './components/player/PlaylistPlayer';
import { startPeriodicSync } from './services/deviceSync';
import localforage from 'localforage';
import { PlaylistItem } from './types/player';

export default function App() {
  const [token, setToken] = useState<string>('');
  const [currentPlaylist, setCurrentPlaylist] = useState<PlaylistItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const generateNewToken = async () => {
    try {
      const newToken = await window.electronAPI.generateToken();
      setToken(newToken);
      await localforage.setItem('device_token', newToken);
    } catch (error) {
      console.error('Error generating token:', error);
      toast.error('Failed to generate token');
    }
  };

  useEffect(() => {
    const initializeApp = async () => {
      // Check for existing token
      const savedToken = await localforage.getItem('device_token');
      if (savedToken) {
        setToken(savedToken as string);
        
        // Start sync process
        const deviceId = await localforage.getItem('device_id');
        if (deviceId) {
          startPeriodicSync(deviceId as string, savedToken as string);
        }
      } else {
        generateNewToken();
      }
      
      // Load cached playlist
      const cachedPlaylist = await localforage.getItem('current_playlist');
      if (cachedPlaylist) {
        setCurrentPlaylist(cachedPlaylist as PlaylistItem[]);
      }
      
      setIsInitialized(true);
    };
    
    initializeApp();
  }, []);

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Device Player</h1>
          <div className="flex items-center justify-center space-x-2">
            <p className="text-3xl font-mono">{token}</p>
            <Button
              size="icon"
              variant="ghost"
              onClick={generateNewToken}
              className="h-8 w-8"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {currentPlaylist.length > 0 && (
          <PlaylistPlayer 
            playlist={currentPlaylist}
            onTrackChange={(track) => {
              console.log('Now playing:', track.title);
            }}
          />
        )}
      </Card>
    </div>
  );
}