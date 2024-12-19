import express, { Response } from 'express';
import { Song } from '../../models/schemas/admin/SongSchema';
import { authMiddleware, adminMiddleware } from '../../middleware/auth.middleware';
import multer from 'multer';
import { bunnyConfig } from '../../config/bunny';
import { generateRandomString, sanitizeFileName } from '../../utils/helpers';
import { logger } from '../../utils/logger';
import { ChunkUploadService } from '../../services/upload/ChunkUploadService';
import { MetadataService } from '../../services/upload/MetadataService';

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
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

// Get all songs
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (error) {
    logger.error('Error fetching songs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Upload a new song
router.post(
  '/upload',
  authMiddleware,
  adminMiddleware,
  upload.single('file'),
  async (req: AuthRequest & { file?: Express.Multer.File }, res: Response) => {
    const uploadService = new ChunkUploadService((progress) => {
      logger.info(`Upload progress: ${progress}%`);
    });

    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const file = req.file;
      const fileName = `${generateRandomString(8)}-${sanitizeFileName(file.originalname)}`;
      
      const [metadata, fileUrl] = await Promise.all([
        metadataService.extractMetadata(file.buffer, fileName),
        uploadService.uploadFile(file.buffer, fileName)
      ]);

      const user = req.user;

      const song = new Song({
        title: metadata?.title || file.originalname.replace(/\.[^/.]+$/, ""),
        artist: metadata?.artist || null,
        album: metadata?.album || null,
        genre: metadata?.genre ? [metadata.genre] : [],
        duration: null,
        fileUrl: fileUrl,
        bunnyId: fileName,
        artworkUrl: null,
        createdBy: user?.id
      });

      await song.save();
      res.status(201).json(song);

    } catch (error) {
      logger.error('Error uploading song:', error);
      res.status(500).json({ error: 'Failed to upload song' });
    }
});

// Delete a song
router.delete('/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
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
    res.json({ message: 'Song deleted successfully' });

  } catch (error) {
    logger.error('Error deleting song:', error);
    res.status(500).json({ error: 'Failed to delete song' });
  }
});

export default router;