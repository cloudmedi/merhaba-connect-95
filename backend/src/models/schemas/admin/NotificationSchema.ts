import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['info', 'warning', 'error', 'success'],
    default: 'info'
  },
  status: {
    type: String,
    enum: ['unread', 'read'],
    default: 'unread'
  },
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  metadata: { type: mongoose.Schema.Types.Mixed },
  readAt: { type: Date }
}, {
  timestamps: true
});

export const Notification = mongoose.model('Notification', NotificationSchema);