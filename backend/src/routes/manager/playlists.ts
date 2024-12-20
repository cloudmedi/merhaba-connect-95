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
    console.log('Hero playlist request received from user:', _req.user?.userId);
    const playlistService = new PlaylistService(_req.io);
    const playlist = await playlistService.getHeroPlaylist(_req.user?.userId);
    
    if (!playlist) {
      console.log('No hero playlist found for manager');
      return res.status(200).json(null);
    }
    
    return res.json(playlist);
  } catch (error) {
    console.error('Error fetching hero playlist:', error);
    return res.status(500).json({ 
      error: 'Internal server error while fetching hero playlist' 
    });
  }
});

// Manager'ın playlist'lerini getir
router.get('/', async (req: AuthRequest, res) => {
  try {
    console.log('Playlists request received from user:', req.user?.userId);
    const playlistService = new PlaylistService(req.io);
    const playlists = await playlistService.getManagerPlaylists(req.user?.userId);
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