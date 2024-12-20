import express from 'express';
import { PlaylistService } from '../../services/common/PlaylistService';
import { authMiddleware } from '../../middleware/auth.middleware';
import { managerMiddleware } from '../../middleware/manager.middleware';
import { AuthRequest } from '../../types/express';

const router = express.Router();

router.use(authMiddleware);
router.use(managerMiddleware);

// Hero playlist endpoint'i
router.get('/hero', async (_req: AuthRequest, res) => {
  try {
    const playlistService = new PlaylistService(_req.io);
    const heroPlaylist = await playlistService.getHeroPlaylist();
    return res.json(heroPlaylist);
  } catch (error) {
    console.error('Error fetching hero playlist:', error);
    return res.status(500).json({ error: 'Error fetching hero playlist' });
  }
});

// Get manager's playlists
router.get('/', async (req: AuthRequest, res) => {
  try {
    const playlistService = new PlaylistService(req.io);
    const playlists = await playlistService.getManagerPlaylists(req.user?.id);
    return res.json(playlists);
  } catch (error: any) {
    console.error('Error fetching playlists:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch playlists',
      details: error.message 
    });
  }
});

export default router;