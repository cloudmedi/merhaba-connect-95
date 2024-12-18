import mongoose from 'mongoose';

const SongSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  artist: { 
    type: String,
    default: null
  },
  album: { 
    type: String,
    default: null
  },
  genre: [{ 
    type: String 
  }],
  duration: { 
    type: Number,
    default: null,
    validate: {
      validator: function(v: number | null) {
        return v === null || (Number.isFinite(v) && v >= 0);
      },
      message: 'Duration must be a positive number or null'
    }
  },
  fileUrl: { 
    type: String, 
    required: true 
  },
  bunnyId: { 
    type: String 
  },
  artworkUrl: { 
    type: String,
    default: null
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }
}, {
  timestamps: true
});

export const Song = mongoose.model('Song', SongSchema);