import { Types } from 'mongoose';

export interface INotification {
  _id?: Types.ObjectId;
  title: string;
  message: string;
  type: string;
  userId: Types.ObjectId;
  isRead: boolean;
  metadata?: Record<string, any>;
  readAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface INotificationDocument extends INotification, Document {
  _id: Types.ObjectId;
}

export type NotificationCreateInput = Omit<INotification, '_id' | 'createdAt' | 'updatedAt'>;
export type NotificationUpdateInput = Partial<Omit<INotification, '_id' | 'createdAt' | 'updatedAt'>>;