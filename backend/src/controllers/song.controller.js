import Song from '../models/Song.js';

// Upload new song
export const uploadSong = async (req, res) => {
  try {
    const { title, artist, album, genre, duration, fileUrl } = req.body;
    
    const song = await Song.create({
      title,
      artist,
      album,
      genre,
      duration,
      fileUrl,
      createdBy: req.user._id
    });

    res.status(201).json(song);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all songs
export const getSongs = async (req, res) => {
  try {
    const songs = await Song.find({ createdBy: req.user._id });
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get song by ID
export const getSongById = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }
    res.json(song);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update song
export const updateSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }

    if (song.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedSong = await Song.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedSong);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete song
export const deleteSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }

    if (song.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await song.remove();
    res.json({ message: 'Song removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};