import express from 'express';
import { Song } from '../../models/schemas/admin/SongSchema';
import { authMiddleware, adminMiddleware } from '../../middleware/auth.middleware';
import { Request } from 'express';
import { bunnyConfig } from '../../config/bunny';
import fetch from 'node-fetch';
import multer from 'multer';
import crypto from 'crypto';

const upload = multer({ storage: multer.memoryStorage() });

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
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

// Upload song
router.post('/upload', authMiddleware, adminMiddleware, upload.single('file'), async (req: AuthRequest, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileBuffer = req.file.buffer;
    const fileName = `${crypto.randomUUID()}-${req.file.originalname}`;
    const bunnyFileName = `music/${fileName}`;

    // Upload to Bunny CDN
    const bunnyUrl = `${bunnyConfig.baseUrl}/${bunnyConfig.storageZoneName}/${bunnyFileName}`;
    
    const uploadResponse = await fetch(bunnyUrl, {
      method: 'PUT',
      headers: {
        'AccessKey': bunnyConfig.apiKey,
        'Content-Type': req.file.mimetype
      },
      body: fileBuffer
    });

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload to Bunny CDN');
    }

    // Create song record in database
    const song = new Song({
      title: req.file.originalname.replace(/\.[^/.]+$/, ""),
      fileUrl: `https://${bunnyConfig.storageZoneName}.b-cdn.net/${bunnyFileName}`,
      bunnyId: bunnyFileName,
      createdBy: req.user?.id
    });

    await song.save();
    res.status(201).json(song);

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload song' });
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

// Create song
router.post('/', authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  try {
    const song = new Song({
      ...req.body,
      createdBy: req.user?.id
    });
    await song.save();
    res.status(201).json(song);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create song' });
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
    await Song.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete song' });
  }
});

export default router;
