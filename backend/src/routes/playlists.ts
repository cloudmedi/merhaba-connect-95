import express from 'express';
import { auth } from '../middleware/auth';
import { Playlist } from '../models/Playlist';

const router = express.Router();

// Get all playlists
router.get('/', auth, async (req, res) => {
  try {
    const playlists = await Playlist.find()
      .populate('songs.songId')
      .populate('categories')
      .populate('genre')
      .populate('mood')
      .populate('assignedManagers');
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching playlists' });
  }
});

// Create playlist
router.post('/', auth, async (req, res) => {
  try {
    const playlist = new Playlist({
      ...req.body,
      createdBy: req.user.userId
    });
    await playlist.save();
    
    // Emit socket event for real-time updates
    req.io?.emit('playlist:created', playlist);
    
    res.status(201).json(playlist);
  } catch (error) {
    res.status(400).json({ error: 'Error creating playlist' });
  }
});

// Update playlist
router.put('/:id', auth, async (req, res) => {
  try {
    const playlist = await Playlist.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    // Emit socket event for real-time updates
    req.io?.emit('playlist:updated', playlist);
    
    res.json(playlist);
  } catch (error) {
    res.status(400).json({ error: 'Error updating playlist' });
  }
});

// Delete playlist
router.delete('/:id', auth, async (req, res) => {
  try {
    const playlist = await Playlist.findByIdAndDelete(req.params.id);
    
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    // Emit socket event for real-time updates
    req.io?.emit('playlist:deleted', req.params.id);
    
    res.json({ message: 'Playlist deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting playlist' });
  }
});

// Add song to playlist
router.post('/:id/songs', auth, async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    playlist.songs.push({
      songId: req.body.songId,
      position: playlist.songs.length
    });

    await playlist.save();
    
    // Emit socket event for real-time updates
    req.io?.emit('playlist:songAdded', {
      playlistId: playlist.id,
      song: req.body
    });
    
    res.json(playlist);
  } catch (error) {
    res.status(400).json({ error: 'Error adding song to playlist' });
  }
});

export default router;