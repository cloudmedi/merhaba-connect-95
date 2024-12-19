import express, { Response } from 'express';
import { Song } from '../../models/schemas/admin/SongSchema';
import { authMiddleware, adminMiddleware } from '../../middleware/auth.middleware';
import multer from 'multer';
import { bunnyConfig } from '../../config/bunny';
import { generateRandomString, sanitizeFileName } from '../../utils/helpers';
import { logger } from '../../utils/logger';
import { ChunkUploadService } from '../../services/upload/ChunkUploadService';
import { MetadataService } from '../../services/upload/MetadataService';

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
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Dosya yüklenmedi' });
      }

      const file = req.file;
      logger.info(`Uploading file: ${file.originalname}, size: ${file.size} bytes`);

      // Dosya adını oluştur
      const fileName = `${generateRandomString(8)}-${sanitizeFileName(file.originalname)}`;
      logger.info(`Generated filename: ${fileName}`);

      // Upload service oluştur
      const uploadService = new ChunkUploadService((progress) => {
        logger.info(`Upload progress: ${progress}%`);
      });

      try {
        // Dosyayı yükle
        const fileUrl = await uploadService.uploadFile(file.buffer, fileName);
        logger.info('File uploaded to CDN:', fileUrl);

        // Metadata çıkar
        const metadata = await metadataService.extractMetadata(file.buffer, fileName);
        logger.info('Metadata extracted:', metadata);

        const user = req.user;

        // Veritabanına kaydet
        const song = new Song({
          title: metadata?.title || file.originalname.replace(/\.[^/.]+$/, ""),
          artist: metadata?.artist || null,
          album: metadata?.album || null,
          genre: metadata?.genre ? [metadata.genre] : [],
          duration: metadata?.duration || null,
          fileUrl: fileUrl,
          bunnyId: fileName,
          artworkUrl: null,
          createdBy: user?.id
        });

        await song.save();
        logger.info('Song saved to database:', song);
        
        res.status(201).json(song);

      } catch (uploadError: any) {
        logger.error('Error during upload process:', uploadError);
        throw new Error(`Dosya yükleme hatası: ${uploadError.message}`);
      }

    } catch (error: any) {
      logger.error('Error uploading song:', error);
      res.status(400).json({ 
        error: 'Dosya yükleme hatası',
        details: error.message 
      });
    }
});

router.delete('/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ error: 'Şarkı bulunamadı' });
    }

    if (song.bunnyId) {
      const bunnyUrl = `https://${bunnyConfig.baseUrl}/${bunnyConfig.storageZoneName}/${song.bunnyId}`;
      const deleteResponse = await fetch(bunnyUrl, {
        method: 'DELETE',
        headers: {
          'AccessKey': bunnyConfig.apiKey,
          'Accept': '*/*'
        }
      });

      if (!deleteResponse.ok) {
        logger.error('Failed to delete file from Bunny CDN:', await deleteResponse.text());
      }
    }

    await Song.findByIdAndDelete(req.params.id);
    res.json({ message: 'Şarkı başarıyla silindi' });

  } catch (error) {
    logger.error('Error deleting song:', error);
    res.status(500).json({ error: 'Şarkı silinirken hata oluştu' });
  }
});

export default router;