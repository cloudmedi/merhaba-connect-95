import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  subscriptionStatus: {
    type: String,
    enum: ['trial', 'active', 'expired'],
    default: 'trial'
  },
  subscriptionEndsAt: {
    type: Date
  },
  trialEndsAt: {
    type: Date
  },
  trialStatus: {
    type: String,
    enum: ['active', 'expired'],
    default: 'active'
  },
  trialNotificationSent: {
    oneDay: { type: Boolean, default: false },
    threeDays: { type: Boolean, default: false },
    sevenDays: { type: Boolean, default: false }
  }
}, {
  timestamps: true
});

const Company = mongoose.model('Company', companySchema);

export default Company;