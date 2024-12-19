import express from 'express';
import { User } from '../../models/admin/User';
import { Song } from '../../models/admin/Song';
import { Playlist } from '../../models/common/Playlist';
import { adminAuth } from '../../middleware/auth';
import { logger } from '../../utils/logger';

const router = express.Router();

router.get('/system', adminAuth, async (req, res) => {
  try {
    logger.info('Fetching system metrics...');
    
    const activeUsers = await User.countDocuments({ isActive: true });
    const totalSongs = await Song.countDocuments();
    const activePlaylists = await Playlist.countDocuments({ isActive: true });
    
    const metrics = {
      activeUsers,
      totalSongs,
      activePlaylists,
      systemHealth: 98,
      timestamp: new Date().toISOString()
    };

    logger.info('System metrics:', metrics);
    res.json(metrics);
  } catch (error) {
    logger.error('Error fetching system metrics:', error);
    res.status(500).json({ error: 'Error fetching system metrics' });
  }
});

export default router;