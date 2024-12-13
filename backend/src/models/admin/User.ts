import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  role: { 
    type: String, 
    enum: ['admin', 'manager', 'user'],
    default: 'user' 
  },
  companyName: { type: String },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  avatarUrl: { type: String },
  licenses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'License'
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

export const User = mongoose.model('User', UserSchema);