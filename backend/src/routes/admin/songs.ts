import express, { Response, Request } from 'express';
import { Song } from '../../models/schemas/admin/SongSchema';
import { authMiddleware, adminMiddleware } from '../../middleware/auth.middleware';
import multer from 'multer';
import { bunnyConfig } from '../../config/bunny';
import { generateRandomString, sanitizeFileName } from '../../utils/helpers';
import { logger } from '../../utils/logger';
import { ChunkUploadService } from '../../services/upload/ChunkUploadService';
import { MetadataService } from '../../services/upload/MetadataService';
import { join } from 'path';
import { tmpdir } from 'os';
import { writeFile, unlink } from 'fs/promises';
import { getAudioDurationInSeconds } from 'get-audio-duration';

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

interface AuthRequest extends Request {
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
router.post('/upload', 
  authMiddleware, 
  adminMiddleware, 
  upload.single('file'), 
  async (req: Request, res: Response) => {
    const uploadService = new ChunkUploadService((progress) => {
      logger.info(`Upload progress: ${progress}%`);
    });

    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const file = req.file;
      const fileName = `${generateRandomString(8)}-${sanitizeFileName(file.originalname)}`;
      
      logger.info('Starting file upload process', {
        originalName: file.originalname,
        fileName: fileName,
        size: file.size
      });

      // Paralel işlemler
      const [metadata, fileUrl] = await Promise.all([
        metadataService.extractMetadata(file.buffer, fileName),
        uploadService.uploadFile(file.buffer, fileName)
      ]);

      logger.info('File upload and metadata extraction completed', {
        metadata,
        fileUrl
      });

      const user = (req as AuthRequest).user;

      // Duration kontrolü
      if (!metadata.duration && metadata.duration !== 0) {
        logger.warn('Duration not found in metadata, attempting to extract from buffer');
        try {
          const tempFilePath = join(tmpdir(), `duration-${Date.now()}-${fileName}`);
          await writeFile(tempFilePath, file.buffer);
          const duration = await getAudioDurationInSeconds(tempFilePath);
          metadata.duration = Math.round(duration);
          await unlink(tempFilePath);
          logger.info(`Duration extracted successfully: ${metadata.duration} seconds`);
        } catch (durationError) {
          logger.error('Failed to extract duration from buffer:', durationError);
        }
      }

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

      logger.info('Saving song to database', {
        songData: song.toObject()
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
