import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  firstName: { type: String },
  lastName: { type: String },
  role: { type: String, enum: ['admin', 'manager', 'user'], default: 'manager' },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  isActive: { type: Boolean, default: true },
  avatarUrl: { type: String }
}, {
  timestamps: true
});

export const User = mongoose.model('User', UserSchema);