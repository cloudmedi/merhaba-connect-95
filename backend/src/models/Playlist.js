import mongoose from 'mongoose';

const playlistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  artworkUrl: String,
  moodId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mood'
  },
  genreId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Genre'
  },
  isCatalog: {
    type: Boolean,
    default: false
  },
  assignedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  lastPlayed: Date,
  playCount: {
    type: Number,
    default: 0
  },
  isHero: {
    type: Boolean,
    default: false
  },
  songs: [{
    songId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Song'
    },
    position: Number
  }]
}, {
  timestamps: true
});

const Playlist = mongoose.model('Playlist', playlistSchema);

export default Playlist;