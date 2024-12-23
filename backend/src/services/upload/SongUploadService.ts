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
        console.log('Sending progress update:', data);
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
    onProgress: (progress: number) => void,
    res: Response
  ) {
    try {
      const uniqueBunnyId = `song_${uuidv4()}`;
      const fileExtension = file.originalname.split('.').pop();
      const uniqueFileName = `${uniqueBunnyId}.${fileExtension}`;

      // Initialize upload service with progress callback
      this.uploadService = new ChunkUploadService((progress) => {
        console.log(`Progress callback triggered: ${progress}%`);
        onProgress(progress);
        this.sendProgress(res, { 
          type: 'progress', 
          progress,
          status: 'uploading',
          fileName: file.originalname
        });
      });

      // Handle client disconnection
      res.on('close', () => {
        console.log('Client disconnected');
        this.isClientConnected = false;
        if (this.uploadService) {
          this.uploadService.cancel();
        }
      });

      // Start file upload
      this.sendProgress(res, { 
        type: 'status', 
        status: 'uploading',
        fileName: file.originalname,
        progress: 0
      });

      console.log('Starting file upload...');
      const fileUrl = await this.uploadService.uploadFile(file.buffer, uniqueFileName);
      
      if (!fileUrl) {
        throw new Error('File upload failed');
      }

      // Extract metadata
      console.log('Extracting metadata...');
      this.sendProgress(res, { 
        type: 'status', 
        status: 'processing',
        fileName: file.originalname,
        progress: 100
      });

      const metadata = await this.metadataService.extractMetadata(file.buffer, file.originalname);
      
      if (!metadata) {
        throw new Error('Failed to extract metadata');
      }

      // Save to MongoDB
      console.log('Saving to MongoDB...');
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

      logger.info('Attempting to save song to MongoDB:', song);
      const savedSong = await song.save();
      
      if (!savedSong) {
        throw new Error('Failed to save song to database');
      }

      logger.info('Song saved successfully:', savedSong);
      
      // Send completion response
      if (this.isClientConnected && !res.writableEnded) {
        this.sendProgress(res, { 
          type: 'complete', 
          song: savedSong,
          status: 'completed',
          fileName: file.originalname,
          progress: 100
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
          status: 'error',
          fileName: file.originalname
        });
        res.end();
      }
    }
  }
}