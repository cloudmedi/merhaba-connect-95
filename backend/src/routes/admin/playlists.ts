import express from 'express';
import { PlaylistService } from '../../services/common/PlaylistService';
import { adminAuth } from '../../middleware/auth';
import multer from 'multer';
import { ChunkUploadService } from '../../services/upload/ChunkUploadService';
import path from 'path';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Admin middleware'ini tüm route'lara uygula
router.use(adminAuth);

router.post('/upload-artwork', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileExtension = path.extname(req.file.originalname);
    const uniqueFileName = `artwork/${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExtension}`;
    
    const uploadService = new ChunkUploadService();
    const fileUrl = await uploadService.uploadFile(req.file.buffer, uniqueFileName);

    console.log('Artwork uploaded:', fileUrl);
    res.json({ url: fileUrl });

  } catch (error) {
    console.error('Error uploading artwork:', error);
    res.status(500).json({ error: 'Error uploading artwork' });
  }
});

// Assign managers to playlist
router.post('/:id/assign-managers', async (req, res) => {
  try {
    const playlistService = new PlaylistService(req.io);
    const { managerIds } = req.body;
    
    if (!Array.isArray(managerIds)) {
      return res.status(400).json({ error: 'managerIds must be an array' });
    }

    const playlist = await playlistService.assignManagers(req.params.id, managerIds);
    res.json(playlist);
  } catch (error) {
    console.error('Error assigning managers:', error);
    res.status(500).json({ error: 'Error assigning managers to playlist' });
  }
});

// Get playlist songs
router.get('/:id/songs', async (req, res) => {
  try {
    const playlistService = new PlaylistService(req.io);
    const songs = await playlistService.getPlaylistSongs(req.params.id);
    res.json(songs);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching playlist songs' });
  }
});

// Get playlist categories
router.get('/:id/categories', async (req, res) => {
  try {
    const playlistService = new PlaylistService(req.io);
    const categories = await playlistService.getPlaylistCategories(req.params.id);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching playlist categories' });
  }
});

// Get playlist managers
router.get('/:id/managers', async (req, res) => {
  try {
    const playlistService = new PlaylistService(req.io);
    const managers = await playlistService.getPlaylistManagers(req.params.id);
    res.json(managers);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching playlist managers' });
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
