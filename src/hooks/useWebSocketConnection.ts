import { useEffect } from 'react';
import io from 'socket.io-client';

export function useWebSocketConnection() {
  useEffect(() => {
    const socket = io('http://localhost:5001', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
}