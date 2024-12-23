import { Types } from 'mongoose';

export interface IUser {
  _id: Types.ObjectId;  // Artık opsiyonel değil, zorunlu
  id?: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role: 'admin' | 'manager' | 'user';
  companyId?: Types.ObjectId;
  isActive: boolean;
  lastLogin?: Date;
  avatarUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId;
}

export type UserCreateInput = Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>;
export type UserUpdateInput = Partial<Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>>;