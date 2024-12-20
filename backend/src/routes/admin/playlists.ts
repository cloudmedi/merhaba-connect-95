import express, { Response } from 'express';
import { PlaylistService } from '../../services/common/PlaylistService';
import { adminAuth } from '../../middleware/auth';
import multer from 'multer';
import { ChunkUploadService } from '../../services/upload/ChunkUploadService';
import path from 'path';
import { AuthRequest } from '../../types/express';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

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
    return res.json({ url: fileUrl });

  } catch (error) {
    console.error('Error uploading artwork:', error);
    return res.status(500).json({ error: 'Error uploading artwork' });
  }
});

router.post('/:id/assign-managers', async (req, res) => {
  try {
    console.log('Received assign managers request:', {
      playlistId: req.params.id,
      body: req.body
    });

    const playlistService = new PlaylistService(req.io);
    const { managerIds } = req.body;
    
    if (!Array.isArray(managerIds)) {
      console.error('Invalid managerIds:', managerIds);
      return res.status(400).json({ error: 'managerIds must be an array' });
    }

    if (!managerIds.every(id => typeof id === 'string' && id.trim().length > 0)) {
      return res.status(400).json({ error: 'All manager IDs must be valid strings' });
    }

    const playlist = await playlistService.assignManagers(req.params.id, managerIds);
    console.log('Managers assigned successfully:', playlist);
    return res.json(playlist);
  } catch (error: any) {
    console.error('Error assigning managers:', error);
    return res.status(500).json({ error: error.message || 'Error assigning managers to playlist' });
  }
});

// Get playlist songs
router.get('/:id/songs', async (req, res) => {
  try {
    const playlistService = new PlaylistService(req.io);
    const songs = await playlistService.getPlaylistSongs(req.params.id);
    return res.json(songs);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching playlist songs' });
  }
});

// Get playlist categories
router.get('/:id/categories', async (req, res) => {
  try {
    const playlistService = new PlaylistService(req.io);
    const categories = await playlistService.getPlaylistCategories(req.params.id);
    return res.json(categories);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching playlist categories' });
  }
});

// Get playlist managers
router.get('/:id/managers', async (req, res) => {
  try {
    const playlistService = new PlaylistService(req.io);
    const managers = await playlistService.getPlaylistManagers(req.params.id);
    return res.json(managers);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching playlist managers' });
  }
});

// Playlist CRUD
router.post('/', async (req, res) => {
  try {
    const playlistService = new PlaylistService(req.io);
    const playlist = await playlistService.createPlaylist(req.body);
    return res.json(playlist);
  } catch (error) {
    return res.status(500).json({ error: 'Error creating playlist' });
  }
});

router.get('/', async (req, res) => {
  try {
    const playlistService = new PlaylistService(req.io);
    const playlists = await playlistService.getAllPlaylists();
    return res.json(playlists);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching playlists' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const playlistService = new PlaylistService(req.io);
    const playlist = await playlistService.updatePlaylist(req.params.id, req.body);
    return res.json(playlist);
  } catch (error) {
    return res.status(500).json({ error: 'Error updating playlist' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const playlistService = new PlaylistService(req.io);
    await playlistService.deletePlaylist(req.params.id);
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: 'Error deleting playlist' });
  }
});

export default router;