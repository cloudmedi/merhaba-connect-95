import express from 'express';
import { Song } from '../../models/schemas/admin/SongSchema';
import { authMiddleware, adminMiddleware } from '../../middleware/auth.middleware';
import { bunnyConfig } from '../../config/bunny';
import multer from 'multer';
import { Request } from 'express';
import fetch from 'node-fetch';
import { songSchema } from '../../utils/validators';

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

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

// Create song with file upload
router.post('/', authMiddleware, adminMiddleware, upload.single('file'), async (req: AuthRequest, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Upload to Bunny CDN
    const fileName = `${Date.now()}-${req.file.originalname}`;
    const bunnyUrl = `${bunnyConfig.baseUrl}/${bunnyConfig.storageZoneName}/${fileName}`;

    const uploadResponse = await fetch(bunnyUrl, {
      method: 'PUT',
      headers: {
        'AccessKey': bunnyConfig.apiKey,
        'Content-Type': req.file.mimetype
      },
      body: req.file.buffer
    });

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload to Bunny CDN');
    }

    // Create song in database
    const song = new Song({
      title: req.file.originalname.replace(/\.[^/.]+$/, ""),
      fileUrl: fileName,
      bunnyId: fileName,
      createdBy: req.user?.id
    });

    await song.save();
    res.status(201).json(song);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload song' });
  }
});

// Update song
router.put('/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  try {
    const { error } = songSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

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
      await fetch(bunnyUrl, {
        method: 'DELETE',
        headers: {
          'AccessKey': bunnyConfig.apiKey
        }
      });
    }

    await Song.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete song' });
  }
});

export default router;