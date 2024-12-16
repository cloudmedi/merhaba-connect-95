import { Types } from 'mongoose';

export interface IDevice {
  _id?: Types.ObjectId;
  name: string;
  branchId?: Types.ObjectId;
  category: string;
  status: 'online' | 'offline';
  ipAddress?: string;
  systemInfo?: Record<string, any>;
  schedule?: Record<string, any>;
  lastSeen?: Date;
  token?: string;
  location?: string;
  locationId?: Types.ObjectId;
  createdBy?: Types.ObjectId;
  macAddress?: string;
  volume: number;
  currentVersion?: string;
  lastUpdateCheck?: Date;
  updateStatus?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IDeviceDocument extends IDevice, Document {
  _id: Types.ObjectId;
}

export type DeviceCreateInput = Omit<IDevice, '_id' | 'createdAt' | 'updatedAt'>;
export type DeviceUpdateInput = Partial<Omit<IDevice, '_id' | 'createdAt' | 'updatedAt'>>;