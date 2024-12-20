import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log('Auth Middleware - Headers:', req.headers);
    const token = req.headers.authorization?.replace('Bearer ', '') || req.query.token as string;

    console.log('Auth Middleware - Extracted token:', token ? 'Token exists' : 'No token');

    if (!token) {
      console.log('Auth Middleware - No token provided');
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    try {
      console.log('Auth Middleware - Attempting to verify token');
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      console.log('Auth Middleware - Token verified, decoded payload:', decoded);
      req.user = decoded;
      console.log('Auth Middleware - User set in request:', req.user);
      next();
    } catch (verifyError) {
      console.error('Auth Middleware - Token verification failed:', verifyError);
      res.status(401).json({ error: 'Invalid token' });
      return;
    }
  } catch (error) {
    console.error('Auth Middleware - General error:', error);
    res.status(401).json({ error: 'Invalid token' });
    return;
  }
};

export const adminMiddleware = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log('Admin Middleware - Checking user role:', req.user?.role);
    if (req.user?.role !== 'admin' && req.user?.role !== 'super_admin') {
      console.log('Admin Middleware - Access denied for role:', req.user?.role);
      res.status(403).json({ error: 'Admin access required' });
      return;
    }
    next();
  } catch (error) {
    console.error('Admin Middleware - Error:', error);
    res.status(403).json({ error: 'Admin access required' });
    return;
  }
};