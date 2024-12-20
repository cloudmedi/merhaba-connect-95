import { WebSocket, WebSocketServer } from 'ws';
import { createServer } from 'http';
import { logger } from '../utils/logger';

export const initializeWebSocket = () => {
  const wsServer = createServer();
  const wss = new WebSocketServer({ server: wsServer });

  wss.on('connection', (ws: WebSocket) => {
    logger.info('Client bağlandı');

    ws.on('message', (message: string) => {
      try {
        const data = JSON.parse(message.toString());
        
        if (data.type === 'join-playlist') {
          logger.info(`Client playlist'e katıldı: ${data.playlistId}`);
          // Başarılı bağlantı bildirimi
          ws.send(JSON.stringify({ 
            type: 'connection-status', 
            status: 'connected' 
          }));
        }

        if (data.type === 'leave-playlist') {
          logger.info(`Client playlist'ten ayrıldı: ${data.playlistId}`);
        }

        if (data.type === 'ping') {
          ws.send(JSON.stringify({ type: 'pong' }));
        }
      } catch (error) {
        logger.error('WebSocket mesaj işleme hatası:', error);
        ws.send(JSON.stringify({ 
          type: 'error', 
          message: 'Mesaj işlenirken bir hata oluştu' 
        }));
      }
    });

    ws.on('error', (error) => {
      logger.error('WebSocket hatası:', error);
    });

    ws.on('close', () => {
      logger.info('Client ayrıldı');
    });
  });

  const WEBSOCKET_PORT = process.env.WEBSOCKET_PORT || 5001;
  wsServer.listen(WEBSOCKET_PORT, () => {
    logger.info(`WebSocket server running on port ${WEBSOCKET_PORT}`);
  });

  return wss;
};