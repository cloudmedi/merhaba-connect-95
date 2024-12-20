import { Request, Response } from 'express';
import * as argon2 from 'argon2';
import { User } from '../../models/admin/User';
import { logger } from '../../utils/logger';
import { TokenService } from '../../services/TokenService';

export class LoginController {
  private tokenService: TokenService;

  constructor() {
    this.tokenService = new TokenService();
  }

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;

      logger.info('Login attempt started', { 
        email,
        timestamp: new Date().toISOString(),
        requestIP: req.ip
      });

      const user = await User.findOne({ email });
      if (!user) {
        logger.warn('Login failed: User not found', { 
          email,
          timestamp: new Date().toISOString()
        });
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isValidPassword = await argon2.verify(user.password, password);
      if (!isValidPassword) {
        logger.warn('Login failed: Invalid password', { 
          email,
          userId: user._id,
          timestamp: new Date().toISOString()
        });
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = this.tokenService.generateToken(user._id, user.role);

      logger.info('Login successful', {
        userId: user._id,
        email: user.email,
        role: user.role,
        timestamp: new Date().toISOString()
      });

      return res.json({
        token,
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
      logger.error('Login error', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString()
      });
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}