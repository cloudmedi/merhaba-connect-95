import { AuthResponse, LoginCredentials } from "@/types/auth";
import { supabase } from './supabase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const authService = {
  async login({ email, password }: LoginCredentials): Promise<AuthResponse> {
    const { data: { user, session }, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    if (!user || !session) {
      throw new Error('Login failed');
    }

    // Get profile data including avatar_url
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return {
      user: {
        id: user.id,
        email: user.email!,
        firstName: user.user_metadata.firstName || '',
        lastName: user.user_metadata.lastName || '',
        role: user.user_metadata.role,
        companyId: user.user_metadata.companyId,
        isActive: true,
        avatar_url: profile?.avatar_url || null,
        createdAt: user.created_at,
        updatedAt: user.updated_at || user.created_at
      },
      token: session.access_token
    };
  },

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
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
  }
};