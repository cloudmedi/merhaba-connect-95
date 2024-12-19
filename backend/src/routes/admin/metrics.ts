import express from 'express';
import { User } from '../../models/admin/User';
import { Song } from '../../models/admin/Song';
import { Playlist } from '../../models/common/Playlist';
import { adminAuth } from '../../middleware/auth';

const router = express.Router();

router.get('/system', adminAuth, async (req, res) => {
  try {
    const activeUsers = await User.countDocuments({ isActive: true });
    const totalSongs = await Song.countDocuments();
    const activePlaylists = await Playlist.countDocuments({ isActive: true });
    
    const metrics = {
      activeUsers,
      totalSongs,
      activePlaylists,
      systemHealth: 98, // Örnek bir değer
      timestamp: new Date().toISOString()
    };

    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching system metrics' });
  }
});

export default router;