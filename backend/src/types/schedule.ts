import { Types } from 'mongoose';

export interface ISchedule {
  _id?: Types.ObjectId;
  title: string;
  description?: string;
  playlistId: Types.ObjectId;
  startTime: Date;
  endTime: Date;
  recurrence?: {
    type: 'daily' | 'weekly' | 'monthly';
    interval: number;
    endDate?: Date;
  };
  notifications?: {
    before: number;
    recipients: string[];
  };
  createdBy: Types.ObjectId;
  companyId: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IScheduleDocument extends ISchedule, Document {
  _id: Types.ObjectId;
}

export type ScheduleCreateInput = Omit<ISchedule, '_id' | 'createdAt' | 'updatedAt'>;
export type ScheduleUpdateInput = Partial<Omit<ISchedule, '_id' | 'createdAt' | 'updatedAt'>>;