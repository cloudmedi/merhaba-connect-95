import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';

export function useWebSocketConnection() {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const initializeWebSocket = async () => {
      try {
        console.log('Initializing Socket.IO connection...');
        
        if (socketRef.current?.connected) {
          console.log('Closing existing connection');
          socketRef.current.close();
        }

        socketRef.current = io('http://localhost:5001', {
          transports: ['websocket'],
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: 5
        });
        
        socketRef.current.on('connect', () => {
          console.log('Socket.IO connection established');
          setIsConnected(true);
          toast.success('WebSocket bağlantısı kuruldu');
        });

        socketRef.current.on('playlist-updated', (data) => {
          console.log('Playlist update received:', data);
        });

        socketRef.current.on('device-status', (data) => {
          console.log('Device status update:', data);
        });

        socketRef.current.on('notification', (data) => {
          console.log('Notification received:', data);
          toast.info(data.message);
        });

        socketRef.current.on('error', (error) => {
          console.error('Socket.IO error:', error);
          toast.error('WebSocket bağlantı hatası');
        });

        socketRef.current.on('disconnect', (reason) => {
          console.log('Socket.IO disconnected:', reason);
          setIsConnected(false);
          toast.error('WebSocket bağlantısı koptu');
        });

      } catch (error) {
        console.error('Error initializing Socket.IO:', error);
        setIsConnected(false);
        toast.error('WebSocket bağlantısı kurulamadı');
      }
    };

    initializeWebSocket();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, []);

  const sendMessage = (event: string, data: any) => {
    if (!socketRef.current) {
      console.error('Socket.IO not initialized');
      toast.error('WebSocket bağlantısı hazır değil');
      return;
    }

    if (!socketRef.current.connected) {
      console.error('Socket.IO is not connected');
      toast.error('WebSocket bağlantısı kopuk');
      return;
    }

    try {
      console.log('Sending Socket.IO message:', { event, data });
      socketRef.current.emit(event, data);
    } catch (error) {
      console.error('Error sending Socket.IO message:', error);
      toast.error('Mesaj gönderilemedi');
    }
  };

  return { sendMessage, isConnected };
}