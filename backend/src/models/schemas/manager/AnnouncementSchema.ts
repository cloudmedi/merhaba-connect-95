import mongoose from 'mongoose';

const AnnouncementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { 
    type: String,
    enum: ['draft', 'scheduled', 'active', 'completed', 'cancelled'],
    default: 'draft'
  },
  branchIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Branch' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  files: [{
    fileName: String,
    fileUrl: String,
    fileType: String,
    duration: Number
  }]
}, {
  timestamps: true
});

export const Announcement = mongoose.model('Announcement', AnnouncementSchema);