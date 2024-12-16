import { Server } from 'socket.io';

export class WebSocketService {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  // Emit playlist update to all clients in the playlist room
  emitPlaylistUpdate(playlistId: string, data: any) {
    this.io.to(`playlist:${playlistId}`).emit('playlist-updated', data);
  }

  // Emit song update to all connected clients
  emitSongUpdate(songId: string, data: any) {
    this.io.emit('song-updated', { songId, ...data });
  }

  // Emit device status update
  emitDeviceStatusUpdate(deviceId: string, status: string) {
    this.io.emit('device-status', { deviceId, status });
  }

  // Emit new notification
  emitNotification(userId: string, notification: any) {
    this.io.emit(`notification:${userId}`, notification);
  }
}