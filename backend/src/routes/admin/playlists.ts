import express from 'express';
import { PlaylistService } from '../../services/common/PlaylistService';
import { adminAuth } from '../../middleware/auth';
import multer from 'multer';
import path from 'path';

const router = express.Router();
const upload = multer({
  storage: multer.diskStorage({
    destination: './public/lovable-uploads/',
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
      cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
    }
  })
});

// Admin middleware'ini tüm route'lara uygula
router.use(adminAuth);

// Add artwork upload endpoint
router.post('/upload-artwork', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileUrl = `/lovable-uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
  } catch (error) {
    console.error('Error uploading artwork:', error);
    res.status(500).json({ error: 'Error uploading artwork' });
  }
});

// Playlist CRUD
router.post('/', async (req, res) => {
  try {
    const playlistService = new PlaylistService(req.io);
    const playlist = await playlistService.createPlaylist(req.body);
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ error: 'Error creating playlist' });
  }
});

router.get('/', async (req, res) => {
  try {
    const playlistService = new PlaylistService(req.io);
    const playlists = await playlistService.getAllPlaylists();
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching playlists' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const playlistService = new PlaylistService(req.io);
    const playlist = await playlistService.updatePlaylist(req.params.id, req.body);
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ error: 'Error updating playlist' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const playlistService = new PlaylistService(req.io);
    await playlistService.deletePlaylist(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting playlist' });
  }
});

export default router;