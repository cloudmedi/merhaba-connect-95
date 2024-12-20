import { Request, Response } from 'express';
import * as argon2 from 'argon2';
import { User } from '../../models/admin/User';
import { logger } from '../../utils/logger';
import { TokenService } from '../../services/TokenService';

export class RegisterController {
  private tokenService: TokenService;

  constructor() {
    this.tokenService = new TokenService();
  }

  async register(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password, firstName, lastName, role, companyName } = req.body;

      logger.info('Registration attempt', {
        email,
        firstName,
        lastName,
        role,
        timestamp: new Date().toISOString()
      });

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        logger.warn('Registration failed: Email exists', {
          email,
          timestamp: new Date().toISOString()
        });
        return res.status(400).json({ error: 'Email already registered' });
      }

      const hashedPassword = await argon2.hash(password);

      const user = new User({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: role || 'manager',
        isActive: true,
        companyName
      });

      await user.save();

      const token = this.tokenService.generateToken(user._id, user.role);

      logger.info('Registration successful', {
        userId: user._id,
        email: user.email,
        role: user.role,
        timestamp: new Date().toISOString()
      });

      return res.status(201).json({
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
      logger.error('Registration error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString()
      });
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}