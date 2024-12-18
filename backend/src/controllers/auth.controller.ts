import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import * as argon2 from 'argon2';
import { User } from '../models/admin/User';

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      console.log('Login attempt for email:', email);

      const user = await User.findOne({ email });
      if (!user) {
        console.log('Login failed: User not found for email:', email);
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isValidPassword = await argon2.verify(user.password, password);
      if (!isValidPassword) {
        console.log('Login failed: Invalid password for email:', email);
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      console.log('Login successful - Token details:', {
        token: token.substring(0, 20) + '...',
        decoded: jwt.decode(token),
        expiresIn: '7d',
        secret: process.env.JWT_SECRET ? 'Custom secret' : 'Default secret',
        userId: user._id,
        role: user.role
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

      console.log('Registration attempt:', { email, firstName, lastName, role });

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log('Registration failed: Email already exists:', email);
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

      console.log('Registration successful - Token details:', {
        token: token.substring(0, 20) + '...',
        decoded: jwt.decode(token),
        userId: user._id,
        role: user.role
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
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async verifyToken(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      console.log('Token verification request:', {
        receivedToken: token ? token.substring(0, 20) + '...' : 'No token',
        authHeader: req.headers.authorization ? 'Present' : 'Missing'
      });
      
      if (!token) {
        console.log('Token verification failed: No token provided');
        return res.status(401).json({ error: 'No token provided' });
      }

      console.log('Environment check:', {
        jwtSecretExists: !!process.env.JWT_SECRET,
        nodeEnv: process.env.NODE_ENV,
        secretUsed: process.env.JWT_SECRET ? 'Custom secret' : 'Default secret'
      });

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
        console.log('Token verification - Decoded token:', {
          decoded,
          expiresIn: new Date(decoded.exp * 1000).toISOString(),
          userId: decoded.userId,
          role: decoded.role
        });
        
        const user = await User.findById(decoded.userId);
        if (!user) {
          console.log('Token verification failed: User not found for ID:', decoded.userId);
          return res.status(401).json({ error: 'User not found' });
        }

        console.log('Token verification successful for user:', {
          userId: user._id,
          email: user.email,
          role: user.role
        });

        const newToken = jwt.sign(
          { userId: user._id, role: user.role },
          process.env.JWT_SECRET || 'your-secret-key',
          { expiresIn: '7d' }
        );

        console.log('New token generated:', {
          token: newToken.substring(0, 20) + '...',
          decoded: jwt.decode(newToken),
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
        console.error('Token verification failed:', verifyError);
        res.status(401).json({ error: 'Invalid token' });
      }
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(401).json({ error: 'Invalid token' });
    }
  }
}