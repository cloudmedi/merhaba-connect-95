import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Check for token in Authorization header or query parameter
    const token = req.headers.authorization?.replace('Bearer ', '') || req.query.token as string;

    console.log('Auth middleware - Received token:', {
      token: token ? 'Token exists' : 'No token',
      authHeader: req.headers.authorization,
      queryToken: req.query.token
    });

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      console.log('Auth middleware - Token decoded successfully:', {
        decoded,
        expiresIn: new Date((decoded as any).exp * 1000).toISOString()
      });
      req.user = decoded;
      next();
    } catch (verifyError) {
      console.error('Auth middleware - Token verification failed:', verifyError);
      res.status(401).json({ error: 'Invalid token' });
    }
  } catch (error) {
    console.error('Auth middleware - Error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const adminMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user?.role !== 'admin' && req.user?.role !== 'super_admin') {
      console.log('Admin middleware - Access denied:', {
        userRole: req.user?.role,
        requiredRoles: ['admin', 'super_admin']
      });
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  } catch (error) {
    console.error('Admin middleware - Error:', error);
    res.status(403).json({ error: 'Admin access required' });
  }
};