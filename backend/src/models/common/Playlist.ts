import mongoose from 'mongoose';

const PlaylistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  isPublic: { type: Boolean, default: false },
  isHero: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  songs: [{
    songId: { type: mongoose.Schema.Types.ObjectId, ref: 'Song' },
    position: { type: Number }
  }],
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  genre: { type: mongoose.Schema.Types.ObjectId, ref: 'Genre' },
  mood: { type: mongoose.Schema.Types.ObjectId, ref: 'Mood' },
  artworkUrl: { type: String },
  assignedManagers: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: false 
  }],
  lastPlayed: { type: Date },
  playCount: { type: Number, default: 0 }
}, {
  timestamps: true
});

export const Playlist = mongoose.model('Playlist', PlaylistSchema);