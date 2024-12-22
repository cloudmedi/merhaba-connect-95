import mongoose from 'mongoose';

const TokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  macAddress: { type: String, required: true, unique: true },
  systemInfo: { type: Object, required: true },
  status: { type: String, default: 'pending' },
  lastSeen: { type: Date, default: Date.now },
}, {
  timestamps: true
});

export const Token = mongoose.model('Token', TokenSchema);