import { Server } from 'socket.io';
import { logger } from '../../utils/logger';

export class WebSocketService {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  // Emit playlist update to all clients in the playlist room
  emitPlaylistUpdate(playlistId: string, data: any) {
    try {
      this.io.to(`playlist:${playlistId}`).emit('playlist-updated', data);
      logger.info(`Playlist update emitted for playlist ${playlistId}`);
    } catch (error) {
      logger.error('Error emitting playlist update:', error);
    }
  }

  // Emit song update to all connected clients
  emitSongUpdate(songId: string, data: any) {
    try {
      this.io.emit('song-updated', { songId, ...data });
      logger.info(`Song update emitted for song ${songId}`);
    } catch (error) {
      logger.error('Error emitting song update:', error);
    }
  }

  // Emit device status update
  emitDeviceStatusUpdate(deviceId: string, status: string) {
    try {
      this.io.emit('device-status', { deviceId, status });
      logger.info(`Device status update emitted for device ${deviceId}`);
    } catch (error) {
      logger.error('Error emitting device status:', error);
    }
  }

  // Emit new notification
  emitNotification(userId: string, notification: any) {
    try {
      this.io.emit(`notification:${userId}`, notification);
      logger.info(`Notification emitted for user ${userId}`);
    } catch (error) {
      logger.error('Error emitting notification:', error);
    }
  }
}