import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import * as argon2 from 'argon2';
import { User } from '../models/admin/User';
import { logger } from '../utils/logger';

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      logger.info('Login attempt', { email });

      const user = await User.findOne({ email });
      if (!user) {
        logger.warn('Login failed: User not found', { email });
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isValidPassword = await argon2.verify(user.password, password);
      if (!isValidPassword) {
        logger.warn('Login failed: Invalid password', { email });
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      logger.info('Login successful', {
        userId: user._id,
        email: user.email,
        role: user.role,
        tokenPreview: token.substring(0, 20) + '...',
        expiresIn: '7d'
      });

      res.json({
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
      logger.error('Login error', { error });
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async register(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName, role, companyName } = req.body;

      logger.info('Registration attempt', { email, firstName, lastName, role });

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        logger.warn('Registration failed: Email exists', { email });
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

      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      logger.info('Registration successful', {
        userId: user._id,
        email: user.email,
        role: user.role,
        tokenPreview: token.substring(0, 20) + '...'
      });

      res.status(201).json({
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
      logger.error('Registration error', { error });
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async verifyToken(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      logger.info('Token verification request', {
        tokenExists: !!token,
        authHeaderExists: !!req.headers.authorization
      });
      
      if (!token) {
        logger.warn('Token verification failed: No token provided');
        return res.status(401).json({ error: 'No token provided' });
      }

      logger.debug('JWT environment check', {
        jwtSecretExists: !!process.env.JWT_SECRET,
        nodeEnv: process.env.NODE_ENV
      });

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
        logger.debug('Token decoded successfully', {
          userId: decoded.userId,
          role: decoded.role,
          expiresAt: new Date(decoded.exp * 1000).toISOString()
        });
        
        const user = await User.findById(decoded.userId);
        if (!user) {
          logger.warn('Token verification failed: User not found', { userId: decoded.userId });
          return res.status(401).json({ error: 'User not found' });
        }

        logger.info('Token verification successful', {
          userId: user._id,
          email: user.email,
          role: user.role
        });

        const newToken = jwt.sign(
          { userId: user._id, role: user.role },
          process.env.JWT_SECRET || 'your-secret-key',
          { expiresIn: '7d' }
        );

        logger.debug('New token generated', {
          userId: user._id,
          tokenPreview: newToken.substring(0, 20) + '...',
          expiresIn: '7d'
        });

        res.json({ 
          valid: true,
          token: newToken,
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
      } catch (verifyError) {
        logger.error('Token verification failed', { error: verifyError });
        res.status(401).json({ error: 'Invalid token' });
      }
    } catch (error) {
      logger.error('Token verification error', { error });
      res.status(401).json({ error: 'Invalid token' });
    }
  }
}