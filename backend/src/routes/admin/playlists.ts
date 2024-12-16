import express from 'express';
import { PlaylistService } from '../../services/common/PlaylistService';

const router = express.Router();
const playlistService = new PlaylistService();

// Playlist CRUD
router.post('/', async (req, res) => {
  try {
    const playlist = await playlistService.createPlaylist(req.body);
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ error: 'Error creating playlist' });
  }
});

router.get('/', async (req, res) => {
  try {
    const playlists = await playlistService.getAllPlaylists();
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching playlists' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const playlist = await playlistService.updatePlaylist(req.params.id, req.body);
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ error: 'Error updating playlist' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await playlistService.deletePlaylist(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting playlist' });
  }
});

export default router;