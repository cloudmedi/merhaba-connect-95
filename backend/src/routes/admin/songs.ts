import express, { Response } from 'express';
import { Song } from '../../models/schemas/admin/SongSchema';
import { authMiddleware, adminMiddleware } from '../../middleware/auth.middleware';
import multer from 'multer';
import { bunnyConfig } from '../../config/bunny';
import { generateRandomString, sanitizeFileName } from '../../utils/helpers';
import { logger } from '../../utils/logger';
import { ChunkUploadService } from '../../services/upload/ChunkUploadService';
import { MetadataService } from '../../services/upload/MetadataService';
import { v4 as uuidv4 } from 'uuid';

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
    files: 1
  }
});

interface AuthRequest extends express.Request {
  user?: {
    id: string;
    role: string;
  };
}

const router = express.Router();
const metadataService = new MetadataService();

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (error) {
    logger.error('Error fetching songs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post(
  '/upload',
  authMiddleware,
  adminMiddleware,
  upload.single('file'),
  async (req: AuthRequest & { file?: Express.Multer.File }, res: Response) => {
    let uploadService: ChunkUploadService | null = null;

    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Dosya yüklenmedi' });
      }

      const file = req.file;
      logger.info(`Uploading file: ${file.originalname}, size: ${file.size} bytes`);

      const uniqueBunnyId = `song_${uuidv4()}`;
      const fileExtension = file.originalname.split('.').pop();
      const uniqueFileName = `${uniqueBunnyId}.${fileExtension}`;
      
      logger.info(`Generated unique filename: ${uniqueFileName}`);

      // SSE başlatma
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      });

      uploadService = new ChunkUploadService((progress) => {
        // Progress güncellemelerini SSE ile gönder
        res.write(`data: ${JSON.stringify({ progress })}\n\n`);
      });

      const fileUrl = await uploadService.uploadFile(file.buffer, uniqueFileName);
      logger.info('File uploaded to CDN:', fileUrl);

      const metadata = await metadataService.extractMetadata(file.buffer, uniqueFileName);
      logger.info('Metadata extracted:', metadata);

      if (!metadata) {
        throw new Error('Failed to extract metadata');
      }

      const user = req.user;

      const song = new Song({
        title: metadata.title || file.originalname,
        artist: metadata.artist,
        album: metadata.album || null,
        genre: metadata.genre || [],
        duration: metadata.duration,
        fileUrl: fileUrl,
        bunnyId: uniqueBunnyId,
        artworkUrl: null,
        createdBy: user?.id
      });

      await song.save();
      logger.info('Song saved to database:', song);
      
      // Yükleme tamamlandı, son event'i gönder
      res.write(`data: ${JSON.stringify({ type: 'complete', song })}\n\n`);
      res.end();

    } catch (error: any) {
      logger.error('Error during upload process:', error);
      
      if (uploadService) {
        uploadService.cancel();
      }

      // Hata durumunda error event'i gönder
      res.write(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`);
      res.end();
    }
});

router.delete('/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ error: 'Şarkı bulunamadı' });
    }

    if (song.bunnyId) {
      const fileExtension = song.fileUrl.split('.').pop();
      const fileName = `${song.bunnyId}.${fileExtension}`;
      const bunnyUrl = `https://${bunnyConfig.baseUrl}/${bunnyConfig.storageZoneName}/music/${fileName}`;
      
      logger.info(`Attempting to delete file from Bunny CDN: ${bunnyUrl}`);
      
      const deleteResponse = await fetch(bunnyUrl, {
        method: 'DELETE',
        headers: {
          'AccessKey': bunnyConfig.apiKey,
          'Accept': '*/*'
        }
      });

      if (!deleteResponse.ok) {
        const errorText = await deleteResponse.text();
        logger.error('Failed to delete file from Bunny CDN:', {
          status: deleteResponse.status,
          statusText: deleteResponse.statusText,
          error: errorText,
          url: bunnyUrl
        });
        
        // Dosya zaten silinmiş olabilir, bu durumda devam ediyoruz
        if (deleteResponse.status !== 404) {
          throw new Error(`Failed to delete file from CDN: ${errorText}`);
        }
      } else {
        logger.info('Successfully deleted file from Bunny CDN');
      }
    }

    await Song.findByIdAndDelete(req.params.id);
    logger.info(`Song ${req.params.id} successfully deleted`);
    
    res.json({ message: 'Şarkı başarıyla silindi' });

  } catch (error: any) {
    logger.error('Error deleting song:', error);
    res.status(500).json({ 
      error: 'Şarkı silinirken hata oluştu',
      details: error.message 
    });
  }
});

export default router;