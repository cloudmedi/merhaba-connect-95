import api from '@/lib/api';
import { AuthResponse, LoginCredentials, User } from '@/types/auth';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return response.data;
  },

  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
  }): Promise<AuthResponse> {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  async logout(): Promise<void> {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  getUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  async verifyToken(): Promise<{ isValid: boolean; user: User | null }> {
    try {
      const response = await api.get('/auth/verify');
      return {
        isValid: true,
        user: response.data.user
      };
    } catch (error) {
      return {
        isValid: false,
        user: null
      };
    }
  }
};