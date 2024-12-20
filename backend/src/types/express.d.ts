import { Request } from 'express';
import { User } from '../models/admin/User';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export {};