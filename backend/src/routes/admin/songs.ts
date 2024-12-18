import express from 'express';
import { Song } from '../../models/schemas/admin/SongSchema';
import { authMiddleware, adminMiddleware } from '../../middleware/auth.middleware';
import multer from 'multer';
import { bunnyConfig } from '../../config/bunny';
import { generateRandomString, sanitizeFileName } from '../../utils/helpers';
import { logger } from '../../utils/logger';
import fetch, { HeadersInit } from 'node-fetch';

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024 // 20MB limit
  }
});

interface AuthRequest extends express.Request {
  user?: {
    id: string;
    role: string;
  };
  file?: any; // Using any for multer file type
}

const router = express.Router();

// Get all songs
router.get('/', authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  try {
    const songs = await Song.find().sort({ title: 1 });
    res.json(songs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch songs' });
  }
});

// Get song by id
router.get('/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }
    res.json(song);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch song' });
  }
});

// Upload song
router.post('/upload', authMiddleware, adminMiddleware, upload.single('file'), async (req: AuthRequest, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.file;
    const randomString = generateRandomString(8);
    const sanitizedFileName = sanitizeFileName(file.originalname);
    const fileName = `${randomString}-${sanitizedFileName}`;

    // Upload to Bunny CDN
    const bunnyUrl = `${bunnyConfig.baseUrl}/${bunnyConfig.storageZoneName}/${fileName}`;
    
    logger.info(`Uploading to Bunny CDN: ${bunnyUrl}`);

    const headers: HeadersInit = {
      'AccessKey': bunnyConfig.apiKey || '',
      'Content-Type': file.mimetype
    };

    const uploadResponse = await fetch(bunnyUrl, {
      method: 'PUT',
      headers,
      body: file.buffer
    });

    if (!uploadResponse.ok) {
      throw new Error(`Failed to upload to Bunny CDN: ${await uploadResponse.text()}`);
    }

    // Create song record in database
    const song = new Song({
      title: req.body.title || file.originalname.replace(/\.[^/.]+$/, ""),
      artist: req.body.artist,
      album: req.body.album,
      genre: req.body.genre ? JSON.parse(req.body.genre) : [],
      fileUrl: fileName,
      bunnyId: fileName,
      createdBy: req.user?.id
    });

    await song.save();
    res.status(201).json(song);

  } catch (error) {
    logger.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload song' });
  }
});

// Update song
router.put('/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  try {
    const song = await Song.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(song);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update song' });
  }
});

// Delete song
router.delete('/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }

    // Delete from Bunny CDN if bunnyId exists
    if (song.bunnyId) {
      const bunnyUrl = `${bunnyConfig.baseUrl}/${bunnyConfig.storageZoneName}/${song.bunnyId}`;
      const headers: HeadersInit = {
        'AccessKey': bunnyConfig.apiKey || ''
      };

      await fetch(bunnyUrl, {
        method: 'DELETE',
        headers
      });
    }

    await Song.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete song' });
  }
});

export default router;