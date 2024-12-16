import { Types } from 'mongoose';

export interface IAnnouncement {
  _id?: Types.ObjectId;
  title: string;
  message: string;
  startDate: Date;
  endDate: Date;
  status: 'draft' | 'scheduled' | 'active' | 'completed' | 'cancelled';
  branchIds: Types.ObjectId[];
  createdBy: Types.ObjectId;
  companyId: Types.ObjectId;
  files: Array<{
    fileName: string;
    fileUrl: string;
    fileType: string;
    duration?: number;
  }>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAnnouncementDocument extends IAnnouncement, Document {
  _id: Types.ObjectId;
}

export type AnnouncementCreateInput = Omit<IAnnouncement, '_id' | 'createdAt' | 'updatedAt'>;
export type AnnouncementUpdateInput = Partial<Omit<IAnnouncement, '_id' | 'createdAt' | 'updatedAt'>>;