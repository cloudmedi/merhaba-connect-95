import { Request } from 'express';
import { User } from '../models/admin/User';

export interface AuthRequest extends Request {
  user?: User;
  io?: any;
}

export {};