import express from 'express';
import { PlaylistService } from '../../services/common/PlaylistService';
import { authMiddleware } from '../../middleware/auth.middleware';
import { managerMiddleware } from '../../middleware/manager.middleware';
import { AuthRequest } from '../../types/express';

const router = express.Router();

router.use(authMiddleware);
router.use(managerMiddleware);

router.get('/hero', async (_req: AuthRequest, res) => {
  try {
    console.log('Hero playlist request received from user:', _req.user?.id);
    const playlistService = new PlaylistService(_req.io);
    
    // Manager ID'sini geçirerek playlist'i al
    const playlist = await playlistService.getHeroPlaylist(_req.user?.id);
    
    if (!playlist) {
      console.log('No playlist found for manager');
      return res.status(200).json(null);
    }
    
    // Yetkilendirme kontrolü
    const isAssignedToManager = playlist.assignedManagers.some(
      manager => manager._id.toString() === _req.user?.id
    );
    
    console.log('Access check:', {
      playlistId: playlist._id,
      isPublic: playlist.isPublic,
      isAssignedToManager,
      userId: _req.user?.id,
      assignedManagerIds: playlist.assignedManagers.map(m => m._id.toString())
    });
    
    if (!playlist.isPublic && !isAssignedToManager) {
      console.log('Access denied: Playlist is not public and user is not assigned');
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