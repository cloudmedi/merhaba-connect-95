import mongoose from 'mongoose';

const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true },
  subscriptionStatus: {
    type: String,
    enum: ['trial', 'active', 'expired'],
    default: 'trial'
  },
  subscriptionEndsAt: { type: Date },
  maxBranches: { type: Number, default: 1 },
  maxDevices: { type: Number, default: 5 },
  settings: { type: mongoose.Schema.Types.Mixed },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
});

export const Company = mongoose.model('Company', CompanySchema);