import mongoose from 'mongoose';

const ScheduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  playlistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  recurrence: { type: Object },
  notifications: { type: Object },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' }
}, {
  timestamps: true
});

export const Schedule = mongoose.model('Schedule', ScheduleSchema);