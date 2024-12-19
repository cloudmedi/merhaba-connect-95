import mongoose from 'mongoose';

const SongSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true 
  },
  artist: { 
    type: String,
    trim: true,
    default: 'Unknown Artist'
  },
  album: { 
    type: String,
    trim: true 
  },
  genre: [{ 
    type: String,
    trim: true 
  }],
  duration: { 
    type: Number,
    required: true,
    min: 0
  },
  fileUrl: { 
    type: String, 
    required: true 
  },
  bunnyId: { 
    type: String,
    unique: true,
    required: true,
    sparse: true
  },
  artworkUrl: { 
    type: String 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }
}, {
  timestamps: true
});

// Bunny ID için index
SongSchema.index({ bunnyId: 1 }, { unique: true, sparse: true });

export const Song = mongoose.model('Song', SongSchema);