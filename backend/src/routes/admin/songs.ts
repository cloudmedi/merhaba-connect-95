import express, { Response, Request } from 'express';
import { Song } from '../../models/schemas/admin/SongSchema';
import { authMiddleware, adminMiddleware } from '../../middleware/auth.middleware';
import multer from 'multer';
import { bunnyConfig } from '../../config/bunny';
import { generateRandomString, sanitizeFileName } from '../../utils/helpers';
import { logger } from '../../utils/logger';
import fetch from 'node-fetch';
import * as mm from 'music-metadata';

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
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const file = req.file;
      const bunnyId = `music/${generateRandomString(8)}-${sanitizeFileName(file.originalname)}`;
      
      // Extract metadata from the audio file
      const metadata = await mm.parseBuffer(file.buffer);
      
      // Bunny CDN URL'sini oluştur
      const bunnyUrl = `https://${bunnyConfig.baseUrl}/${bunnyConfig.storageZoneName}/${bunnyId}`;
      const publicUrl = `https://cloud-media.b-cdn.net/${bunnyId}`;

      logger.info(`Uploading to Bunny CDN: ${bunnyUrl}`);
      logger.info('Using API Key:', bunnyConfig.apiKey ? 'API Key exists' : 'No API Key');

      const uploadResponse = await fetch(bunnyUrl, {
        method: 'PUT',
        headers: {
          'AccessKey': bunnyConfig.apiKey,
          'Content-Type': file.mimetype,
          'Accept': '*/*'
        },
        body: file.buffer
      });

      if (!uploadResponse.ok) {
        const responseText = await uploadResponse.text();
        logger.error('Bunny CDN upload failed:', responseText);
        throw new Error(`Failed to upload to Bunny CDN: ${responseText}`);
      }

      const user = (req as AuthRequest).user;

      const song = new Song({
        title: metadata.common.title || file.originalname.replace(/\.[^/.]+$/, ""),
        artist: metadata.common.artist || null,
        album: metadata.common.album || null,
        genre: metadata.common.genre || [],
        duration: metadata.format.duration ? Math.round(metadata.format.duration) : null,
        fileUrl: publicUrl,
        bunnyId: bunnyId,
        artworkUrl: null, // TODO: Extract artwork if available
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