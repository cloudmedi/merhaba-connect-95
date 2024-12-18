import { Request, Response } from 'express';
import { User } from '../../models/admin/User';
import { logger } from '../../utils/logger';
import { TokenService } from '../../services/TokenService';

export class TokenController {
  private tokenService: TokenService;

  constructor() {
    this.tokenService = new TokenService();
  }

  async verifyToken(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      logger.info('Token verification request', {
        tokenExists: !!token,
        timestamp: new Date().toISOString()
      });
      
      if (!token) {
        logger.warn('Token verification failed: No token provided', {
          timestamp: new Date().toISOString()
        });
        return res.status(401).json({ error: 'No token provided' });
      }

      const decoded = this.tokenService.verifyToken(token);
      
      if (!decoded) {
        logger.warn('Token verification failed: Invalid token', {
          timestamp: new Date().toISOString()
        });
        return res.status(401).json({ error: 'Invalid token' });
      }

      const user = await User.findById(decoded.userId);
      
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

      // Token geçerliyse, mevcut token'ı koruyoruz ve user bilgisini dönüyoruz
      res.json({ 
        valid: true,
        token: token, // Mevcut token'ı geri gönderiyoruz
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isActive: user.isActive,
          companyName: user.companyName
        }
      });
    } catch (error) {
      logger.error('Token verification error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString()
      });
      res.status(401).json({ error: 'Invalid token' });
    }
  }
}