import express from 'express';
import { auth } from '../middleware/auth';
import { Song } from '../models/Song';
import { FileService } from '../services/file.service';

const router = express.Router();
const fileService = new FileService();

// Get all songs
router.get('/', auth, async (req, res) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching songs' });
  }
});

// Create song with file upload
router.post('/', auth, async (req, res) => {
  try {
    const file = req.files?.audio;
    if (!file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    const fileDoc = await fileService.saveFile(file, req.user.userId);
    
    const song = new Song({
      ...req.body,
      fileUrl: fileDoc.path,
      createdBy: req.user.userId
    });

    await song.save();
    
    // Emit socket event for real-time updates
    req.io?.emit('song:created', song);
    
    res.status(201).json(song);
  } catch (error) {
    res.status(400).json({ error: 'Error creating song' });
  }
});

// Update song
router.put('/:id', auth, async (req, res) => {
  try {
    const song = await Song.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }

    // Emit socket event for real-time updates
    req.io?.emit('song:updated', song);
    
    res.json(song);
  } catch (error) {
    res.status(400).json({ error: 'Error updating song' });
  }
});

// Delete song
router.delete('/:id', auth, async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    
    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }

    // Delete associated file
    await fileService.deleteFile(song.fileUrl);
    await song.deleteOne();

    // Emit socket event for real-time updates
    req.io?.emit('song:deleted', req.params.id);
    
    res.json({ message: 'Song deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting song' });
  }
});

export default router;