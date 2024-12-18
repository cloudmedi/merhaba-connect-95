import mongoose from 'mongoose';

const SongSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String },
  album: { type: String },
  genre: [{ type: String }],
  duration: { type: Number },
  fileUrl: { type: String, required: true },
  bunnyId: { type: String },
  artworkUrl: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
});

export const Song = mongoose.model('Song', SongSchema);