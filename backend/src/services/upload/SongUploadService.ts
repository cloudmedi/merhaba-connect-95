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

      this.uploadService = new ChunkUploadService((progress) => {
        if (this.isClientConnected) {
          this.sendProgress(res, { type: 'progress', progress });
        }
      });

      res.on('close', () => {
        this.isClientConnected = false;
        if (this.uploadService) {
          this.uploadService.cancel();
        }
      });

      const fileUrl = await this.uploadService.uploadFile(file.buffer, uniqueFileName);
      
      if (!this.isClientConnected) {
        throw new Error('Client disconnected');
      }

      const metadata = await this.metadataService.extractMetadata(file.buffer, uniqueFileName);
      
      if (!metadata) {
        throw new Error('Failed to extract metadata');
      }

      const song = new Song({
        title: metadata.title || file.originalname,
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
      
      if (this.isClientConnected && !res.writableEnded) {
        this.sendProgress(res, { 
          type: 'complete', 
          song: savedSong 
        });
        res.end();
      }

    } catch (error: any) {
      logger.error('Error during song upload:', error);
      
      if (this.uploadService) {
        try {
          this.uploadService.cancel();
        } catch (cancelError) {
          logger.error('Error cancelling upload:', cancelError);
        }
      }

      if (!res.writableEnded) {
        this.sendProgress(res, { 
          type: 'error', 
          error: error.message || 'Upload failed'
        });
        res.end();
      }
    }
  }

  public cancelUpload() {
    this.isClientConnected = false;
    if (this.uploadService) {
      this.uploadService.cancel();
    }
  }
}