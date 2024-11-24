import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function usePlaylistSubscription() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Enable REPLICA IDENTITY FULL for the playlists table to ensure we get complete row data
    const channel = supabase
      .channel('playlist-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'playlists'
        },
        (payload) => {
          console.log('Playlist change detected:', payload);

          // Invalidate queries based on the type of change
          if (payload.eventType === 'UPDATE') {
            // If the hero status changed, show a toast
            if (payload.old && payload.new && payload.old.is_hero !== payload.new.is_hero && payload.new.is_hero) {
              toast.success("Hero playlist has been updated");
            }

            // Always invalidate both queries to ensure UI is up to date
            queryClient.invalidateQueries({ queryKey: ['hero-playlist'] });
            queryClient.invalidateQueries({ queryKey: ['manager-categories'] });
          } else if (payload.eventType === 'INSERT' || payload.eventType === 'DELETE') {
            queryClient.invalidateQueries({ queryKey: ['manager-categories'] });
          }
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
        
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to playlist changes');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Error subscribing to playlist changes');
          toast.error("Error subscribing to playlist updates");
        }
      });

    return () => {
      console.log('Cleaning up playlist subscription');
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}