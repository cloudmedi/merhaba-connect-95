import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  subscriptionStatus: { 
    type: String, 
    enum: ['trial', 'active', 'expired'],
    default: 'trial' 
  },
  subscriptionEndsAt: Date,
  trialEndsAt: Date,
  trialStatus: { 
    type: String, 
    enum: ['active', 'expired'],
    default: 'active' 
  }
}, {
  timestamps: true
});

export const Company = mongoose.model('Company', companySchema);