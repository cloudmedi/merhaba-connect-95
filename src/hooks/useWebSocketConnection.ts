import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useWebSocketConnection() {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const initializeWebSocket = async () => {
      try {
        // Get current user's token
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.error('No active session found');
          return;
        }

        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        if (!supabaseUrl) {
          console.error('Supabase URL not found');
          return;
        }

        const wsUrl = `${supabaseUrl.replace('https://', 'wss://')}/functions/v1/sync-playlist`;
        console.log('Initializing WebSocket connection...');

        wsRef.current = new WebSocket(wsUrl);
        
        wsRef.current.onopen = () => {
          console.log('WebSocket connection established');
          // Send authentication message
          if (wsRef.current) {
            wsRef.current.send(JSON.stringify({
              type: 'authenticate',
              payload: {
                token: session.access_token
              }
            }));
          }
        };

        wsRef.current.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log('WebSocket message received:', data);
            
            switch (data.type) {
              case 'auth_success':
                console.log('WebSocket authenticated successfully');
                break;
              case 'sync_success':
                toast.success('Playlist sync successful');
                break;
              case 'sync_error':
                toast.error(data.payload.message || 'Playlist sync failed');
                break;
              case 'presence_update':
                console.log('Device presence updated:', data.payload);
                break;
              default:
                console.log('Unhandled message type:', data.type);
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        wsRef.current.onerror = (error) => {
          console.error('WebSocket error:', error);
          toast.error('WebSocket connection error');
        };

        wsRef.current.onclose = () => {
          console.log('WebSocket connection closed');
          // Attempt to reconnect after a delay
          setTimeout(initializeWebSocket, 5000);
        };
      } catch (error) {
        console.error('Error initializing WebSocket:', error);
        toast.error('Failed to initialize WebSocket connection');
      }
    };

    initializeWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);

  const sendMessage = (message: any) => {
    if (!wsRef.current) {
      console.error('WebSocket not initialized');
      toast.error('WebSocket connection not ready');
      return;
    }

    if (wsRef.current.readyState !== WebSocket.OPEN) {
      console.error('WebSocket is not connected');
      toast.error('WebSocket connection lost');
      return;
    }

    try {
      console.log('Sending WebSocket message:', message);
      wsRef.current.send(JSON.stringify(message));
    } catch (error) {
      console.error('Error sending WebSocket message:', error);
      toast.error('Failed to send message');
    }
  };

  return { sendMessage };
}