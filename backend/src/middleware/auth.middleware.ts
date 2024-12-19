import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    logger.info('Auth middleware - Received token:', {
      token: token ? 'Token exists' : 'No token',
      authHeader: req.headers.authorization
    });

    if (!token) {
      logger.warn('Auth middleware - No token provided');
      return res.status(401).json({ error: 'Authentication required' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string; role: string };
      logger.info('Auth middleware - Token decoded successfully:', {
        userId: decoded.userId,
        role: decoded.role,
        expiresIn: new Date((decoded as any).exp * 1000).toISOString()
      });
      
      req.user = {
        id: decoded.userId,
        role: decoded.role
      };
      
      next();
    } catch (verifyError) {
      logger.error('Auth middleware - Token verification failed:', verifyError);
      res.status(401).json({ error: 'Invalid token' });
    }
  } catch (error) {
    logger.error('Auth middleware - Error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const adminMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user?.role !== 'admin' && req.user?.role !== 'super_admin') {
      logger.warn('Admin middleware - Access denied:', {
        userRole: req.user?.role,
        requiredRoles: ['admin', 'super_admin']
      });
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  } catch (error) {
    logger.error('Admin middleware - Error:', error);
    res.status(403).json({ error: 'Admin access required' });
  }
};