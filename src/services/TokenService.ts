import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

export class TokenService {
  generateToken(userId: Types.ObjectId, role: string): string {
    return jwt.sign(
      { userId: userId.toString(), role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
  }

  validateToken(token: string): boolean {
    try {
      jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      return true;
    } catch {
      return false;
    }
  }
}