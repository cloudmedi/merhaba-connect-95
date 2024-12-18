import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import * as argon2 from 'argon2';
import { User } from '../models/admin/User';
import { logger } from '../utils/logger';

export class AuthController {
  async login(req: Request, res: Response) {
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

      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      logger.info('Login successful', {
        userId: user._id,
        email: user.email,
        role: user.role,
        tokenPreview: `${token.substring(0, 10)}...`,
        timestamp: new Date().toISOString(),
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
      logger.error('Login error', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString()
      });
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async register(req: Request, res: Response) {
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

      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      logger.info('Registration successful', {
        userId: user._id,
        email: user.email,
        role: user.role,
        tokenPreview: `${token.substring(0, 10)}...`,
        timestamp: new Date().toISOString()
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
      logger.error('Registration error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString()
      });
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async verifyToken(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      logger.info('Token verification request', {
        tokenExists: !!token,
        authHeaderExists: !!req.headers.authorization,
        timestamp: new Date().toISOString(),
        headers: req.headers
      });
      
      if (!token) {
        logger.warn('Token verification failed: No token provided', {
          timestamp: new Date().toISOString()
        });
        return res.status(401).json({ error: 'No token provided' });
      }

      logger.debug('JWT environment check', {
        jwtSecretExists: !!process.env.JWT_SECRET,
        nodeEnv: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
      });

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
        logger.debug('Token decoded successfully', {
          userId: decoded.userId,
          role: decoded.role,
          expiresAt: new Date(decoded.exp * 1000).toISOString(),
          timestamp: new Date().toISOString()
        });
        
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

        const newToken = jwt.sign(
          { userId: user._id, role: user.role },
          process.env.JWT_SECRET || 'your-secret-key',
          { expiresIn: '7d' }
        );

        logger.debug('New token generated', {
          userId: user._id,
          tokenPreview: `${newToken.substring(0, 10)}...`,
          expiresIn: '7d',
          timestamp: new Date().toISOString()
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
        logger.error('Token verification failed', {
          error: verifyError instanceof Error ? verifyError.message : 'Unknown error',
          stack: verifyError instanceof Error ? verifyError.stack : undefined,
          timestamp: new Date().toISOString()
        });
        res.status(401).json({ error: 'Invalid token' });
      }
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