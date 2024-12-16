import mongoose from 'mongoose';

const DeviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
  category: { type: String, required: true },
  status: { type: String, default: 'offline' },
  ipAddress: { type: String },
  systemInfo: { type: Object, default: {} },
  schedule: { type: Object, default: {} },
  lastSeen: { type: Date },
  token: { type: String },
  location: { type: String },
  locationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  macAddress: { type: String },
  volume: { type: Number, default: 50 },
  currentVersion: { type: String },
  lastUpdateCheck: { type: Date },
  updateStatus: { type: String }
}, {
  timestamps: true
});

export const Device = mongoose.model('Device', DeviceSchema);