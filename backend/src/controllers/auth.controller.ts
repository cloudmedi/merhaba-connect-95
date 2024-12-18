import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import * as argon2 from 'argon2';
import { User } from '../models/admin/User';

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isValidPassword = await argon2.verify(user.password, password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      console.log('Login successful - Generated token:', {
        token,
        decoded: jwt.decode(token),
        secret: process.env.JWT_SECRET ? 'Secret exists' : 'Using fallback secret'
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
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async register(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName, role, companyName } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
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
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async verifyToken(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      console.log('Token verification request:', {
        receivedToken: token,
        authHeader: req.headers.authorization
      });
      
      if (!token) {
        console.log('No token provided in request');
        return res.status(401).json({ error: 'No token provided' });
      }

      console.log('Environment check:', {
        jwtSecretExists: !!process.env.JWT_SECRET,
        nodeEnv: process.env.NODE_ENV
      });

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
        console.log('Token successfully decoded:', {
          decoded,
          expiresIn: new Date(decoded.exp * 1000).toISOString()
        });
        
        const user = await User.findById(decoded.userId);
        if (!user) {
          console.log('User not found for decoded token userId:', decoded.userId);
          return res.status(401).json({ error: 'User not found' });
        }

        const newToken = jwt.sign(
          { userId: user._id, role: user.role },
          process.env.JWT_SECRET || 'your-secret-key',
          { expiresIn: '7d' }
        );

        console.log('New token generated:', {
          newToken,
          decoded: jwt.decode(newToken)
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
        console.error('Token verification failed:', verifyError);
        res.status(401).json({ error: 'Invalid token' });
      }
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(401).json({ error: 'Invalid token' });
    }
  }
}