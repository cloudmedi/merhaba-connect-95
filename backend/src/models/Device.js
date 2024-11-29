import mongoose from 'mongoose';

const deviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch'
  },
  category: {
    type: String,
    required: true,
    enum: ['player', 'display', 'controller']
  },
  status: {
    type: String,
    enum: ['online', 'offline'],
    default: 'offline'
  },
  ipAddress: String,
  systemInfo: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },
  schedule: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },
  lastSeen: Date,
  token: String,
  location: String,
  locationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location'
  }
}, {
  timestamps: true
});

const Device = mongoose.model('Device', deviceSchema);

export default Device;