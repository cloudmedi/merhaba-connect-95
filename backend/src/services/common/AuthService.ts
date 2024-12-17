import { User } from '../../models/admin/User';
import * as argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { IUser } from '../../types/user';

export class AuthService {
  async validateUser(email: string, password: string): Promise<IUser> {
    const user = await User.findOne({ email });
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await argon2.verify(user.password, password);
    
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // MongoDB'den gelen null değerleri undefined'a dönüştür
    const userObject = {
      ...user.toObject(),
      _id: user._id,
      id: user._id.toString(),
      firstName: user.firstName || undefined,
      lastName: user.lastName || undefined,
      companyId: user.companyId || undefined,
      lastLogin: user.lastLogin || undefined,
      avatarUrl: user.avatarUrl || undefined
    };

    return userObject;
  }

  generateToken(userId: string, role: string): string {
    return jwt.sign(
      { userId, role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      return true;
    } catch {
      return false;
    }
  }
}