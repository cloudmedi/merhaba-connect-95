import mongoose from 'mongoose';

const DeviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
  category: { type: String, required: true },
  status: {
    type: String,
    enum: ['online', 'offline', 'maintenance'],
    default: 'offline'
  },
  ipAddress: { type: String },
  systemInfo: { type: mongoose.Schema.Types.Mixed },
  schedule: { type: mongoose.Schema.Types.Mixed },
  lastSeen: { type: Date },
  token: { type: String },
  location: { type: String },
  volume: { type: Number, default: 50 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
});

export const Device = mongoose.model('Device', DeviceSchema);