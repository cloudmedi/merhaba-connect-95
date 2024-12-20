import { Response } from 'express';
import { Song } from '../../models/schemas/admin/SongSchema';
import { ChunkUploadService } from './ChunkUploadService';
import { MetadataService } from './MetadataService';
import { logger } from '../../utils/logger';
import { v4 as uuidv4 } from 'uuid';

export class SongUploadService {
  private uploadService: ChunkUploadService | null = null;
  private metadataService: MetadataService;
  private isClientConnected: boolean = true;

  constructor() {
    this.metadataService = new MetadataService();
  }

  private sendProgress(res: Response, data: any) {
    if (this.isClientConnected && !res.writableEnded) {
      try {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
      } catch (error) {
        logger.error('Error sending progress:', error);
        this.isClientConnected = false;
      }
    }
  }

  public async uploadSong(
    file: Express.Multer.File,
    userId: string | undefined,
    res: Response
  ) {
    try {
      const uniqueBunnyId = `song_${uuidv4()}`;
      const fileExtension = file.originalname.split('.').pop();
      const uniqueFileName = `${uniqueBunnyId}.${fileExtension}`;

      // Progress callback'i oluştur
      this.uploadService = new ChunkUploadService((progress) => {
        this.sendProgress(res, { 
          type: 'progress', 
          progress,
          status: 'uploading'
        });
      });

      // Client bağlantısı koptuğunda
      res.on('close', () => {
        this.isClientConnected = false;
        if (this.uploadService) {
          this.uploadService.cancel();
        }
      });

      // Dosya yükleme
      this.sendProgress(res, { type: 'status', status: 'uploading' });
      const fileUrl = await this.uploadService.uploadFile(file.buffer, uniqueFileName);
      
      if (!fileUrl) {
        throw new Error('File upload failed');
      }

      // Metadata çıkarma
      this.sendProgress(res, { type: 'status', status: 'processing' });
      const metadata = await this.metadataService.extractMetadata(file.buffer, file.originalname);
      
      if (!metadata) {
        throw new Error('Failed to extract metadata');
      }

      // MongoDB'ye kaydetme
      const song = new Song({
        title: metadata.title || file.originalname.replace(/\.[^/.]+$/, ""),
        artist: metadata.artist || 'Unknown Artist',
        album: metadata.album || null,
        genre: metadata.genre || [],
        duration: metadata.duration || 0,
        fileUrl: fileUrl,
        bunnyId: uniqueBunnyId,
        artworkUrl: null,
        createdBy: userId
      });

      const savedSong = await song.save();
      logger.info('Song saved to MongoDB:', savedSong);
      
      if (this.isClientConnected && !res.writableEnded) {
        this.sendProgress(res, { 
          type: 'complete', 
          song: savedSong,
          status: 'completed'
        });
        res.end();
      }

    } catch (error: any) {
      logger.error('Error during song upload:', error);
      
      if (this.uploadService) {
        this.uploadService.cancel();
      }

      if (!res.writableEnded) {
        this.sendProgress(res, { 
          type: 'error', 
          error: error.message || 'Upload failed',
          status: 'error'
        });
        res.end();
      }
    }
  }
}