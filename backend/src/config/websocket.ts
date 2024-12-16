import { Server } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { logger } from '../utils/logger';

export const initializeWebSocket = (httpServer: HTTPServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      methods: ['GET', 'POST']
    },
    pingTimeout: 60000,
    pingInterval: 25000
  });

  io.on('connection', (socket) => {
    logger.info('Client bağlandı:', socket.id);

    socket.on('join-playlist', (playlistId: string) => {
      try {
        socket.join(`playlist:${playlistId}`);
        logger.info(`Client ${socket.id} playlist'e katıldı: ${playlistId}`);
      } catch (error) {
        logger.error(`Playlist'e katılma hatası:`, error);
        socket.emit('error', { message: 'Playlist\'e katılırken bir hata oluştu' });
      }
    });

    socket.on('leave-playlist', (playlistId: string) => {
      try {
        socket.leave(`playlist:${playlistId}`);
        logger.info(`Client ${socket.id} playlist'ten ayrıldı: ${playlistId}`);
      } catch (error) {
        logger.error(`Playlist'ten ayrılma hatası:`, error);
        socket.emit('error', { message: 'Playlist\'ten ayrılırken bir hata oluştu' });
      }
    });

    socket.on('error', (error) => {
      logger.error('WebSocket hatası:', error);
    });

    socket.on('disconnect', (reason) => {
      logger.info(`Client ayrıldı: ${socket.id}, Sebep: ${reason}`);
    });
  });

  io.on('connect_error', (error) => {
    logger.error('WebSocket bağlantı hatası:', error);
  });

  return io;
};