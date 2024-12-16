import mongoose from 'mongoose';

const DeviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  token: { type: String, required: true, unique: true },
  status: { type: String, default: 'offline' },
  lastSeen: { type: Date },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
  systemInfo: {
    os: String,
    version: String,
    memory: Number,
    diskSpace: Number
  },
  ipAddress: { type: String },
  location: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
});

export const Device = mongoose.model('Device', DeviceSchema);