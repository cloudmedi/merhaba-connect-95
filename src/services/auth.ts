import { AuthResponse, LoginCredentials } from "@/types/auth";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const authService = {
  async login({ email, password }: LoginCredentials): Promise<AuthResponse> {
    console.log('Login attempt started:', { email });
    
    const response = await fetch(`${API_URL}/admin/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Login failed:', error);
      throw new Error(error.error || 'Login failed');
    }

    const data = await response.json();
    console.log('Login successful:', { 
      hasToken: !!data.token,
      hasUser: !!data.user,
      userData: data.user 
    });
    
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
    console.log('Logout called - Removing token and user from localStorage');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getToken(): string | null {
    const token = localStorage.getItem('token');
    console.log('Getting token from localStorage:', { hasToken: !!token });
    return token;
  },

  setToken(token: string): void {
    console.log('Setting token in localStorage');
    localStorage.setItem('token', token);
  },

  setUser(user: any): void {
    console.log('Setting user in localStorage:', user);
    localStorage.setItem('user', JSON.stringify(user));
  },

  getUser(): any {
    const user = localStorage.getItem('user');
    console.log('Getting user from localStorage:', { hasUser: !!user });
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated(): boolean {
    const isAuth = !!this.getToken();
    console.log('Checking authentication status:', { isAuthenticated: isAuth });
    return isAuth;
  },

  async verifyToken(): Promise<{ isValid: boolean; user: any }> {
    try {
      const token = this.getToken();
      console.log('Token verification started:', { hasToken: !!token });
      
      if (!token) {
        console.log('No token found for verification');
        return { isValid: false, user: null };
      }

      const response = await fetch(`${API_URL}/admin/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Token verification response status:', response.status);

      if (!response.ok) {
        console.error('Token verification failed:', response.status);
        return { isValid: false, user: null };
      }

      const data = await response.json();
      console.log('Token verification successful:', {
        responseData: data,
        hasNewToken: !!data.token,
        hasUser: !!data.user
      });
      
      // Yeni token gelirse güncelle
      if (data.token) {
        console.log('Updating token in localStorage with new token');
        this.setToken(data.token);
      }

      // Kullanıcı bilgilerini de localStorage'a kaydet
      if (data.user) {
        console.log('Updating user in localStorage with verified user data');
        this.setUser(data.user);
      }

      return { isValid: true, user: data.user };
    } catch (error) {
      console.error('Token verification error:', error);
      return { isValid: false, user: null };
    }
  }
};