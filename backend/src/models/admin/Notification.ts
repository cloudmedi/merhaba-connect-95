import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: String, default: 'unread' },
  priority: { type: String, default: 'normal' },
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  readAt: { type: Date },
  metadata: { type: Object, default: {} },
  isRead: { type: Boolean, default: false }
}, {
  timestamps: true
});

export const Notification = mongoose.model('Notification', NotificationSchema);