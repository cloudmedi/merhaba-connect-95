import { Request, Response } from 'express';
import { User } from '../../models/admin/User';
import { logger } from '../../utils/logger';
import { TokenService } from '../../services/TokenService';

export class TokenController {
  private tokenService: TokenService;

  constructor() {
    this.tokenService = new TokenService();
  }

  async verifyToken(req: Request, res: Response): Promise<Response> {
    try {
      // Cache kontrolünü devre dışı bırak
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');

      console.log('Token verification - Request headers:', req.headers);
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      logger.info('Token verification request', {
        tokenExists: !!token,
        timestamp: new Date().toISOString(),
        headers: req.headers
      });
      
      if (!token) {
        logger.warn('Token verification failed: No token provided', {
          timestamp: new Date().toISOString()
        });
        return res.status(401).json({ error: 'No token provided' });
      }

      console.log('Token verification - Attempting to verify token');
      const decoded = this.tokenService.verifyToken(token);
      console.log('Token verification - Decoded payload:', decoded);
      
      if (!decoded) {
        logger.warn('Token verification failed: Invalid token', {
          timestamp: new Date().toISOString()
        });
        return res.status(401).json({ error: 'Invalid token' });
      }

      console.log('Token verification - Looking up user:', decoded.userId);
      const user = await User.findById(decoded.userId);
      console.log('Token verification - User found:', user ? 'Yes' : 'No');
      
      if (!user) {
        logger.warn('Token verification failed: User not found', {
          userId: decoded.userId,
          timestamp: new Date().toISOString()
        });
        return res.status(401).json({ error: 'User not found' });
      }

      logger.info('Token verification successful', {
        userId: user._id,
        email: user.email,
        role: user.role,
        timestamp: new Date().toISOString()
      });

      // Kullanıcı bilgilerini ve token'ı birlikte dönüyoruz
      const userData = {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isActive: user.isActive,
        companyName: user.companyName
      };

      console.log('Token verification - Sending response with user data:', userData);

      return res.json({
        valid: true,
        user: userData,
        token
      });
    } catch (error) {
      console.error('Token verification - Error:', error);
      logger.error('Token verification error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString()
      });
      return res.status(401).json({ error: 'Invalid token' });
    }
  }
}