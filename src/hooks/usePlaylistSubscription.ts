import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { io } from 'socket.io-client';

export function usePlaylistSubscription() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
      path: '/socket.io'
    });

    socket.on('connect', () => {
      console.log('WebSocket connected for playlist updates');
    });

    socket.on('playlist-updated', (payload) => {
      console.log('Playlist update received:', payload);
      
      if (payload.action === 'UPDATE') {
        // If the hero status changed, show a toast
        if (payload.playlist.isHero) {
          toast.success("Hero playlist has been updated");
        }

        // Invalidate queries to refresh the UI
        queryClient.invalidateQueries({ queryKey: ['hero-playlist'] });
        queryClient.invalidateQueries({ queryKey: ['manager-categories'] });
      } else if (payload.action === 'CREATE' || payload.action === 'DELETE') {
        queryClient.invalidateQueries({ queryKey: ['manager-categories'] });
      }
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected from playlist updates');
    });

    socket.on('error', (error) => {
      console.error('WebSocket error:', error);
      toast.error("Error receiving playlist updates");
    });

    return () => {
      console.log('Cleaning up playlist subscription');
      socket.disconnect();
    };
  }, [queryClient]);
}