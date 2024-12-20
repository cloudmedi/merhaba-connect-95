import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

export class TokenService {
  private readonly jwtSecret: string;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
  }

  generateToken(userId: Types.ObjectId, role: string): string {
    return jwt.sign(
      { userId: userId.toString(), role },
      this.jwtSecret,
      { expiresIn: '7d' }
    );
  }

  verifyToken(token: string): { userId: string; role: string } | null {
    try {
      return jwt.verify(token, this.jwtSecret) as { userId: string; role: string };
    } catch {
      return null;
    }
  }
}