import mongoose from 'mongoose';

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  artist: {
    type: String,
    trim: true
  },
  album: {
    type: String,
    trim: true
  },
  genre: [{
    type: String
  }],
  duration: Number,
  fileUrl: {
    type: String,
    required: true
  },
  bunnyId: String,
  artworkUrl: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const Song = mongoose.model('Song', songSchema);

export default Song;