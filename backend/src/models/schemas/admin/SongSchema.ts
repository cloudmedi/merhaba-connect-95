import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

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
    default: () => `song_${uuidv4()}`
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

// Tekrarlanan index tanımını kaldırdık, schema tanımındaki unique: true yeterli

export const Song = mongoose.model('Song', SongSchema);