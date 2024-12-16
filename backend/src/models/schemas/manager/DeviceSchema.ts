import mongoose from 'mongoose';

const DeviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['online', 'offline', 'maintenance'],
    default: 'offline'
  },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
  lastPing: { type: Date },
  metadata: { type: mongoose.Schema.Types.Mixed },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
});

export const Device = mongoose.model('Device', DeviceSchema);