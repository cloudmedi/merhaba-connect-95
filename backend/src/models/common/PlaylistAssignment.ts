import mongoose from 'mongoose';

const PlaylistAssignmentSchema = new mongoose.Schema({
  playlistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Playlist', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['pending', 'active', 'expired'],
    default: 'pending'
  },
  scheduledAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  lastPlayed: { type: Date },
  playCount: { type: Number, default: 0 }
}, {
  timestamps: true
});

export const PlaylistAssignment = mongoose.model('PlaylistAssignment', PlaylistAssignmentSchema);