import mongoose from 'mongoose';

const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true },
  subscriptionStatus: { type: String, default: 'trial' },
  subscriptionEndsAt: { type: Date },
  trialEndsAt: { type: Date },
  trialStatus: { type: String, default: 'active' },
  trialNotificationSent: {
    type: Object,
    default: {
      '1_day': false,
      '3_days': false,
      '7_days': false
    }
  }
}, {
  timestamps: true
});

export const Company = mongoose.model('Company', CompanySchema);