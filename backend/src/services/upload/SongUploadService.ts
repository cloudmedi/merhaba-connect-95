import { Response } from 'express';
import { Song } from '../../models/schemas/admin/SongSchema';
import { ChunkUploadService } from './ChunkUploadService';
import { MetadataService } from './MetadataService';
import { logger } from '../../utils/logger';
import { v4 as uuidv4 } from 'uuid';

export class SongUploadService {
  private uploadService: ChunkUploadService | null = null;
  private metadataService: MetadataService;

  constructor() {
    this.metadataService = new MetadataService();
  }

  private isClientConnected(res: Response): boolean {
    return !res.writableEnded;
  }

  private sendProgress(res: Response, data: any) {
    if (this.isClientConnected(res)) {
      try {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
      } catch (error) {
        logger.error('Error sending progress:', error);
        throw error;
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
        if (this.isClientConnected(res)) {
          this.sendProgress(res, { progress });
        }
      });

      // Add cleanup callback
      this.uploadService.addCleanupCallback(() => {
        if (this.isClientConnected(res)) {
          this.sendProgress(res, { type: 'error', error: 'Upload cancelled' });
          res.end();
        }
      });

      const fileUrl = await this.uploadService.uploadFile(file.buffer, uniqueFileName);
      
      if (!this.isClientConnected(res)) {
        throw new Error('Client disconnected');
      }

      const metadata = await this.metadataService.extractMetadata(file.buffer, uniqueFileName);
      
      if (!metadata) {
        throw new Error('Failed to extract metadata');
      }

      const song = new Song({
        title: metadata.title || file.originalname,
        artist: metadata.artist,
        album: metadata.album || null,
        genre: metadata.genre || [],
        duration: metadata.duration,
        fileUrl: fileUrl,
        bunnyId: uniqueBunnyId,
        artworkUrl: null,
        createdBy: userId
      });

      await song.save();
      
      if (this.isClientConnected(res)) {
        this.sendProgress(res, { type: 'complete', song });
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

      if (this.isClientConnected(res)) {
        this.sendProgress(res, { type: 'error', error: error.message });
        res.end();
      }
      
      throw error;
    }
  }

  public cancelUpload() {
    if (this.uploadService) {
      this.uploadService.cancel();
    }
  }
}