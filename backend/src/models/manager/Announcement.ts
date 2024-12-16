import mongoose from 'mongoose';

const AnnouncementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, default: 'pending' },
  startDate: { type: Date },
  endDate: { type: Date },
  repeatType: { type: String, default: 'once' },
  repeatInterval: { type: Number, default: 1 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' }
}, {
  timestamps: true
});

export const Announcement = mongoose.model('Announcement', AnnouncementSchema);