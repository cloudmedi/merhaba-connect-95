import { Types } from 'mongoose';

export interface IBaseDocument {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPaginationOptions {
  page?: number;
  limit?: number;
  sort?: Record<string, 1 | -1>;
}

export interface IPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IQueryFilters {
  search?: string;
  startDate?: Date;
  endDate?: Date;
  status?: string;
  [key: string]: any;
}