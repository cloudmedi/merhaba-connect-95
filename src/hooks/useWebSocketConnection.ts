import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useWebSocketConnection() {
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const initializeWebSocket = async () => {
      try {
        console.log('Initializing WebSocket connection...');
        
        // Get current user's token
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.error('No active session found');
          toast.error('Oturum bulunamadı');
          return;
        }

        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        if (!supabaseUrl) {
          console.error('Supabase URL not found');
          toast.error('Bağlantı bilgileri eksik');
          return;
        }

        const wsUrl = `${supabaseUrl.replace('https://', 'wss://')}/functions/v1/sync-playlist`;
        console.log('Connecting to WebSocket URL:', wsUrl);

        if (wsRef.current?.readyState === WebSocket.OPEN) {
          console.log('Closing existing connection');
          wsRef.current.close();
        }

        wsRef.current = new WebSocket(wsUrl);
        
        wsRef.current.onopen = () => {
          console.log('WebSocket connection established');
          setIsConnected(true);
          // Send authentication message
          if (wsRef.current) {
            console.log('Sending authentication message');
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
                toast.success('WebSocket bağlantısı kuruldu');
                break;
              case 'sync_success':
                toast.success('Playlist senkronizasyonu başarılı');
                break;
              case 'sync_error':
                console.error('Sync error:', data.payload);
                toast.error(data.payload.message || 'Senkronizasyon başarısız');
                break;
              case 'presence_update':
                console.log('Device presence updated:', data.payload);
                break;
              case 'error':
                console.error('WebSocket error:', data.payload);
                toast.error(data.payload.message || 'Bir hata oluştu');
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
          setIsConnected(false);
          toast.error('WebSocket bağlantı hatası');
        };

        wsRef.current.onclose = () => {
          console.log('WebSocket connection closed');
          setIsConnected(false);
          // Attempt to reconnect after a delay
          reconnectTimeoutRef.current = setTimeout(initializeWebSocket, 5000);
        };
      } catch (error) {
        console.error('Error initializing WebSocket:', error);
        setIsConnected(false);
        toast.error('WebSocket bağlantısı kurulamadı');
      }
    };

    initializeWebSocket();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);

  const sendMessage = (message: any) => {
    if (!wsRef.current) {
      console.error('WebSocket not initialized');
      toast.error('WebSocket bağlantısı hazır değil');
      return;
    }

    if (wsRef.current.readyState !== WebSocket.OPEN) {
      console.error('WebSocket is not connected');
      toast.error('WebSocket bağlantısı kopuk');
      return;
    }

    try {
      console.log('Sending WebSocket message:', message);
      wsRef.current.send(JSON.stringify(message));
    } catch (error) {
      console.error('Error sending WebSocket message:', error);
      toast.error('Mesaj gönderilemedi');
    }
  };

  return { sendMessage, isConnected };
}