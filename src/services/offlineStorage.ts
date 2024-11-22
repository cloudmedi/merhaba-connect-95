import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface OfflineDB extends DBSchema {
  songs: {
    key: string;
    value: {
      id: string;
      title: string;
      artist: string;
      file_url: string;
      artwork_url: string;
      audioBlob: Blob;
      size: number;
      downloadedAt: Date;
    };
  };
}

class OfflineStorageService {
  private db: IDBPDatabase<OfflineDB> | null = null;
  private readonly DB_NAME = 'offlineMusic';
  private readonly STORE_NAME = 'songs';

  async initDB() {
    if (!this.db) {
      this.db = await openDB<OfflineDB>(this.DB_NAME, 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('songs')) {
            db.createObjectStore('songs', { keyPath: 'id' });
          }
        },
      });
    }
    return this.db;
  }

  async saveSong(song: {
    id: string;
    title: string;
    artist: string;
    file_url: string;
    artwork_url: string;
  }) {
    const db = await this.initDB();
    
    try {
      // Check if song already exists
      const existingSong = await db.get('songs', song.id);
      if (existingSong) {
        throw new Error('Song already downloaded');
      }

      // Download the audio file
      const audioResponse = await fetch(song.file_url);
      const audioBlob = await audioResponse.blob();

      // Save to IndexedDB
      await db.put('songs', {
        ...song,
        audioBlob,
        size: audioBlob.size,
        downloadedAt: new Date(),
      });

      return true;
    } catch (error) {
      console.error('Error saving song:', error);
      throw error;
    }
  }

  async getSong(id: string) {
    const db = await this.initDB();
    return db.get('songs', id);
  }

  async getAllSongs() {
    const db = await this.initDB();
    return db.getAll('songs');
  }

  async deleteSong(id: string) {
    const db = await this.initDB();
    await db.delete('songs', id);
  }

  async getTotalStorageUsed() {
    const songs = await this.getAllSongs();
    return songs.reduce((total, song) => total + song.size, 0);
  }
}

export const offlineStorage = new OfflineStorageService();