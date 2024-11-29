import Playlist from '../models/Playlist.js';

// Create new playlist
export const createPlaylist = async (req, res) => {
  try {
    const { name, description } = req.body;
    const playlist = await Playlist.create({
      name,
      description,
      createdBy: req.user._id
    });
    res.status(201).json(playlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all playlists
export const getPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({ createdBy: req.user._id })
      .populate('songs.songId');
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get playlist by ID
export const getPlaylistById = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id)
      .populate('songs.songId');
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update playlist
export const updatePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    if (playlist.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedPlaylist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete playlist
export const deletePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    if (playlist.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await playlist.remove();
    res.json({ message: 'Playlist removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add song to playlist
export const addSongToPlaylist = async (req, res) => {
  try {
    const { songId, position } = req.body;
    const playlist = await Playlist.findById(req.params.id);
    
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    playlist.songs.push({ songId, position });
    await playlist.save();
    
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove song from playlist
export const removeSongFromPlaylist = async (req, res) => {
  try {
    const { songId } = req.body;
    const playlist = await Playlist.findById(req.params.id);
    
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    playlist.songs = playlist.songs.filter(song => song.songId.toString() !== songId);
    await playlist.save();
    
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};