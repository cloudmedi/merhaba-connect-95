import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

export const initializeWebSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Join room for playlist updates
    socket.on('join-playlist', (playlistId: string) => {
      socket.join(`playlist:${playlistId}`);
    });

    // Leave playlist room
    socket.on('leave-playlist', (playlistId: string) => {
      socket.leave(`playlist:${playlistId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};