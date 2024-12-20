import mongoose from 'mongoose';

const TokenSchema = new mongoose.Schema({
  token: { 
    type: String, 
    required: true, 
    unique: true,
    length: 6
  },
  macAddress: { 
    type: String, 
    required: true, 
    unique: true 
  },
  isUsed: { 
    type: Boolean, 
    default: false 
  },
  createdAt: { 
    type: Date, 
    default: Date.now
  }
});

export const Token = mongoose.model('Token', TokenSchema);