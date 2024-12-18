import { AuthResponse, LoginCredentials } from "@/types/auth";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const authService = {
  async login({ email, password }: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/admin/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const data = await response.json();
    this.setToken(data.token);
    return data;
  },

  async register(userData: { 
    email: string; 
    password: string; 
    firstName: string; 
    lastName: string;
    role: string;
  }): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/admin/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    const data = await response.json();
    return data;
  },

  async logout(): Promise<void> {
    // Sadece logout işleminde token'ı sil
    localStorage.removeItem('token');
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  setToken(token: string): void {
    localStorage.setItem('token', token);
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  async verifyToken(): Promise<{ isValid: boolean; user: any }> {
    try {
      const token = this.getToken();
      if (!token) return { isValid: false, user: null };

      const response = await fetch(`${API_URL}/admin/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return { isValid: false, user: null };
      }

      const data = await response.json();
      
      // Yeni token gelirse güncelle
      if (data.token) {
        this.setToken(data.token);
      }

      return { isValid: true, user: data.user };
    } catch {
      return { isValid: false, user: null };
    }
  }
};