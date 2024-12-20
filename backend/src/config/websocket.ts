import { Server } from 'socket.io';
import { createServer } from 'http';
import { logger } from '../utils/logger';

export const initializeWebSocket = () => {
  const wsServer = createServer();
  
  const io = new Server(wsServer, {
    cors: {
      origin: ['http://localhost:3000', 'http://localhost:4173', 'http://localhost:4174', 'http://localhost:5173'],
      methods: ['GET', 'POST'],
      credentials: true
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
        
        // Bağlantı başarılı bildirimi
        socket.emit('connection-status', { status: 'connected' });
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

    // Ping-pong mekanizması
    socket.on('ping', () => {
      socket.emit('pong');
    });

    socket.on('error', (error) => {
      logger.error('WebSocket hatası:', error);
    });

    socket.on('disconnect', (reason) => {
      logger.info(`Client ayrıldı: ${socket.id}, Sebep: ${reason}`);
    });
  });

  const WEBSOCKET_PORT = process.env.WEBSOCKET_PORT || 5001;
  wsServer.listen(WEBSOCKET_PORT, () => {
    logger.info(`WebSocket server running on port ${WEBSOCKET_PORT}`);
  });

  return io;
};