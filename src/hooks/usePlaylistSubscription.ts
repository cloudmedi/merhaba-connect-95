import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function usePlaylistSubscription() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:5001');

    ws.onopen = () => {
      console.log('WebSocket connected for playlist updates');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Playlist update received:', data);
        
        if (data.type === 'playlist_updated') {
          // Hero playlist güncellemesi
          if (data.payload.playlist.isHero) {
            toast.success("Hero playlist has been updated");
            queryClient.invalidateQueries({ queryKey: ['hero-playlist'] });
          }

          // Kategori güncellemesi
          queryClient.invalidateQueries({ queryKey: ['manager-categories'] });
        }
      } catch (error) {
        console.error('Error processing playlist update:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast.error("Error receiving playlist updates");
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected from playlist updates');
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [queryClient]);
}