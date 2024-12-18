import express, { Response, Request } from 'express';
import { Song } from '../../models/schemas/admin/SongSchema';
import { authMiddleware, adminMiddleware } from '../../middleware/auth.middleware';
import multer from 'multer';
import { bunnyConfig } from '../../config/bunny';
import { generateRandomString, sanitizeFileName } from '../../utils/helpers';
import { logger } from '../../utils/logger';
import fetch from 'node-fetch';

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
      const bunnyId = `${generateRandomString(8)}-${sanitizeFileName(file.originalname)}`;
      const bunnyUrl = `${bunnyConfig.baseUrl}/${bunnyConfig.storageZoneName}/${bunnyId}`;

      logger.info(`Uploading to Bunny CDN: ${bunnyUrl}`);

      const uploadResponse = await fetch(bunnyUrl, {
        method: 'PUT',
        headers: {
          'AccessKey': bunnyConfig.apiKey || '',
          'Content-Type': file.mimetype,
          'Accept': 'application/json'
        },
        body: file.buffer
      });

      if (!uploadResponse.ok) {
        throw new Error(`Failed to upload to Bunny CDN: ${await uploadResponse.text()}`);
      }

      const user = (req as AuthRequest).user;

      const song = new Song({
        title: req.body.title,
        artist: req.body.artist,
        album: req.body.album,
        genre: req.body.genre,
        duration: req.body.duration,
        bunnyId: bunnyId,
        fileUrl: bunnyUrl,
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
      const bunnyUrl = `${bunnyConfig.baseUrl}/${bunnyConfig.storageZoneName}/${song.bunnyId}`;
      const deleteResponse = await fetch(bunnyUrl, {
        method: 'DELETE',
        headers: {
          'AccessKey': bunnyConfig.apiKey || '',
          'Accept': 'application/json'
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