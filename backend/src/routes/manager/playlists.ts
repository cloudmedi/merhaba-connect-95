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
    
    // Playlist bulunamadıysa 200 ile boş response
    if (!heroPlaylist) {
      return res.status(200).json(null);
    }
    
    // Playlist var ama public değilse 403
    if (!heroPlaylist.isPublic) {
      return res.status(403).json({ 
        error: 'This playlist is not public' 
      });
    }
    
    return res.json(heroPlaylist);
  } catch (error) {
    console.error('Error fetching hero playlist:', error);
    return res.status(500).json({ 
      error: 'Internal server error while fetching hero playlist' 
    });
  }
});

// Get manager's playlists - Sadece public ve kendine atanmış playlist'ler
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