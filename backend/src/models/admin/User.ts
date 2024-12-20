import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role: 'admin' | 'manager' | 'user';
  companyName?: string;
  isActive: boolean;
  lastLogin?: Date;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
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
  avatarUrl: { type: String }
}, {
  timestamps: true
});

export const User = mongoose.model<IUser>('User', UserSchema);