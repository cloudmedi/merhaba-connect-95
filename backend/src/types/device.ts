import { Types } from 'mongoose';

export interface IDevice {
  _id?: Types.ObjectId;
  name: string;
  token: string;
  status: 'online' | 'offline' | 'maintenance';
  lastSeen?: Date;
  branchId?: Types.ObjectId;
  systemInfo?: {
    os: string;
    version: string;
    memory: number;
    diskSpace: number;
  };
  ipAddress?: string;
  location?: string;
  createdBy: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IDeviceDocument extends IDevice, Document {
  _id: Types.ObjectId;
}

export type DeviceCreateInput = Omit<IDevice, '_id' | 'createdAt' | 'updatedAt'>;
export type DeviceUpdateInput = Partial<Omit<IDevice, '_id' | 'createdAt' | 'updatedAt'>>;