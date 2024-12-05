import { app } from 'electron';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as crypto from 'crypto';

export class FileSystemManager {
  private readonly baseDir: string;
  private readonly deviceId: string;

  constructor(deviceId: string) {
    this.deviceId = deviceId;
    this.baseDir = path.join(app.getPath('userData'), 'offline-music', deviceId);
    this.initializeDirectories();
  }

  private initializeDirectories() {
    const dirs = [
      path.join(this.baseDir, 'songs'),
      path.join(this.baseDir, 'playlists'),
      path.join(this.baseDir, 'metadata')
    ];

    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  async saveSong(songId: string, songBuffer: Buffer): Promise<string> {
    const filePath = this.getSongPath(songId);
    await fs.writeFile(filePath, songBuffer);
    const hash = this.calculateFileHash(songBuffer);
    return hash;
  }

  async savePlaylistInfo(playlistId: string, data: any): Promise<void> {
    const filePath = path.join(this.baseDir, 'playlists', `${playlistId}.json`);
    await fs.writeJson(filePath, data, { spaces: 2 });
  }

  async saveMetadata(songId: string, metadata: any): Promise<void> {
    const filePath = path.join(this.baseDir, 'metadata', `${songId}.json`);
    await fs.writeJson(filePath, metadata, { spaces: 2 });
  }

  getSongPath(songId: string): string {
    return path.join(this.baseDir, 'songs', `song_${songId}.mp3`);
  }

  async songExists(songId: string): Promise<boolean> {
    return fs.existsSync(this.getSongPath(songId));
  }

  private calculateFileHash(buffer: Buffer): string {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  async getStorageStats(): Promise<{ used: number; total: number }> {
    const songDir = path.join(this.baseDir, 'songs');
    let used = 0;

    const files = await fs.readdir(songDir);
    for (const file of files) {
      const stats = await fs.stat(path.join(songDir, file));
      used += stats.size;
    }

    return {
      used,
      total: await this.getDiskSpace()
    };
  }

  private async getDiskSpace(): Promise<number> {
    // Default to 1GB if we can't get disk space
    return 1024 * 1024 * 1024;
  }

  async cleanup(keepSongIds: string[]): Promise<void> {
    const songDir = path.join(this.baseDir, 'songs');
    const files = await fs.readdir(songDir);

    for (const file of files) {
      const songId = file.replace('song_', '').replace('.mp3', '');
      if (!keepSongIds.includes(songId)) {
        await fs.unlink(path.join(songDir, file));
      }
    }
  }
}