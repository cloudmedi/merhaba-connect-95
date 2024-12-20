import { Request, Response } from 'express';
import * as argon2 from 'argon2';
import { User } from '../../models/admin/User';
import { logger } from '../../utils/logger';
import { TokenService } from '../../services/TokenService';
import { Types } from 'mongoose';

export class LoginController {
  private tokenService: TokenService;

  constructor() {
    this.tokenService = new TokenService();
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const user = await User.findOne({ email });

      if (!user) {
        logger.warn(`Login attempt failed: User not found - ${email}`);
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      if (!user.isActive) {
        logger.warn(`Login attempt failed: Inactive user - ${email}`);
        return res.status(401).json({ error: 'Account is inactive' });
      }

      const isValidPassword = await argon2.verify(user.password, password);

      if (!isValidPassword) {
        logger.warn(`Login attempt failed: Invalid password - ${email}`);
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const userId = Types.ObjectId.isValid(user._id) ? user._id : new Types.ObjectId(user._id);
      const token = this.tokenService.generateToken(userId, user.role);

      // Update last login
      await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });

      logger.info(`User logged in successfully: ${email}`);
      return res.json({
        token,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          companyName: user.companyName,
          isActive: user.isActive,
          lastLogin: user.lastLogin,
          avatarUrl: user.avatarUrl
        }
      });
    } catch (error) {
      logger.error('Login error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}