import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

export class TokenService {
  private readonly jwtSecret: string;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
  }

  generateToken(userId: Types.ObjectId, role: string): string {
    console.log('Generating token for:', { userId: userId.toString(), role });
    const token = jwt.sign(
      { userId: userId.toString(), role },
      this.jwtSecret,
      { expiresIn: '7d' }
    );
    console.log('Token generated successfully');
    return token;
  }

  verifyToken(token: string): { userId: string; role: string } | null {
    try {
      console.log('Verifying token');
      const decoded = jwt.verify(token, this.jwtSecret) as { userId: string; role: string };
      console.log('Token verified successfully:', decoded);
      return decoded;
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  }
}