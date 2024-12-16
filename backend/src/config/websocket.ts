import { Server } from 'socket.io';
import { Server as HTTPServer } from 'http';

export const initializeWebSocket = (httpServer: HTTPServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join-playlist', (playlistId: string) => {
      socket.join(`playlist:${playlistId}`);
    });

    socket.on('leave-playlist', (playlistId: string) => {
      socket.leave(`playlist:${playlistId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};