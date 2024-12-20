import { WebSocket, WebSocketServer } from 'ws';
import { logger } from '../../utils/logger';

export class WebSocketService {
  private wss: WebSocketServer;

  constructor(wss: WebSocketServer) {
    this.wss = wss;
  }

  // Emit playlist update to all clients
  emitPlaylistUpdate(playlistId: string, data: any) {
    try {
      this.broadcast(JSON.stringify({
        type: 'playlist-updated',
        playlistId,
        data
      }));
      logger.info(`Playlist update emitted for playlist ${playlistId}`);
    } catch (error) {
      logger.error('Error emitting playlist update:', error);
    }
  }

  // Emit song update to all connected clients
  emitSongUpdate(songId: string, data: any) {
    try {
      this.broadcast(JSON.stringify({
        type: 'song-updated',
        songId,
        data
      }));
      logger.info(`Song update emitted for song ${songId}`);
    } catch (error) {
      logger.error('Error emitting song update:', error);
    }
  }

  // Emit device status update
  emitDeviceStatusUpdate(deviceId: string, status: string) {
    try {
      this.broadcast(JSON.stringify({
        type: 'device-status',
        deviceId,
        status
      }));
      logger.info(`Device status update emitted for device ${deviceId}`);
    } catch (error) {
      logger.error('Error emitting device status:', error);
    }
  }

  // Emit notification
  emitNotification(userId: string, notification: any) {
    try {
      this.broadcast(JSON.stringify({
        type: 'notification',
        userId,
        notification
      }));
      logger.info(`Notification emitted for user ${userId}`);
    } catch (error) {
      logger.error('Error emitting notification:', error);
    }
  }

  // Helper method to broadcast to all clients
  private broadcast(data: string) {
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }
}