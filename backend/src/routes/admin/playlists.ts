import express from 'express';
import { PlaylistService } from '../../services/common/PlaylistService';
import { adminAuth } from '../../middleware/auth';
import { AuthRequest } from '../../types/express';

const router = express.Router();

router.use(adminAuth);

// Hero playlist endpoint'i
router.get('/hero', async (_req, res) => {
  try {
    const playlistService = new PlaylistService(_req.io);
    const heroPlaylist = await playlistService.getHeroPlaylist();
    return res.json(heroPlaylist);
  } catch (error) {
    console.error('Error fetching hero playlist:', error);
    return res.status(500).json({ error: 'Error fetching hero playlist' });
  }
});

// Get all playlists
router.get('/', async (req: AuthRequest, res) => {
  try {
    const playlistService = new PlaylistService(req.io);
    const playlists = await playlistService.getAllPlaylists();
    return res.json(playlists);
  } catch (error: any) {
    console.error('Error fetching playlists:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch playlists',
      details: error.message 
    });
  }
});

// Create playlist
router.post('/', async (req: AuthRequest, res) => {
  try {
    const playlistService = new PlaylistService(req.io);
    const playlist = await playlistService.createPlaylist(req.body);
    return res.status(201).json(playlist);
  } catch (error: any) {
    console.error('Error creating playlist:', error);
    return res.status(500).json({ 
      error: 'Failed to create playlist',
      details: error.message 
    });
  }
});

// Update playlist
router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Playlist ID is required' });
    }

    const playlistService = new PlaylistService(req.io);
    const playlist = await playlistService.updatePlaylist(id, req.body);
    return res.json(playlist);
  } catch (error: any) {
    console.error('Error updating playlist:', error);
    return res.status(500).json({ 
      error: 'Failed to update playlist',
      details: error.message 
    });
  }
});

// Delete playlist
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const playlistService = new PlaylistService(req.io);
    await playlistService.deletePlaylist(req.params.id);
    return res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting playlist:', error);
    return res.status(500).json({ 
      error: 'Failed to delete playlist',
      details: error.message 
    });
  }
});

export default router;