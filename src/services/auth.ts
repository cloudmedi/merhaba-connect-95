import { AuthResponse, LoginCredentials } from "@/types/auth";
import { supabase } from '@/integrations/supabase/client';

export const authService = {
  async login({ email, password }: LoginCredentials): Promise<AuthResponse> {
    try {
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) throw signInError;

      if (!authData.user) {
        throw new Error('No user data returned');
      }

      // Fetch the user's profile data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*, companies (*)')
        .eq('id', authData.user.id)
        .single();

      if (profileError || !profile) {
        console.error('Profile fetch error:', profileError);
        throw new Error('Failed to fetch user profile');
      }

      if (!profile.is_active) {
        throw new Error('Your account has been deactivated');
      }

      return {
        user: {
          id: authData.user.id,
          email: authData.user.email!,
          firstName: profile.first_name || '',
          lastName: profile.last_name || '',
          role: profile.role as "super_admin" | "manager" | "admin",
          companyId: profile.company_id,
          isActive: profile.is_active,
          createdAt: authData.user.created_at,
          updatedAt: profile.updated_at || authData.user.created_at,
          company: profile.companies ? {
            id: profile.companies.id,
            name: profile.companies.name,
            subscriptionStatus: profile.companies.subscription_status,
            subscriptionEndsAt: profile.companies.subscription_ends_at
          } : undefined
        },
        token: authData.session?.access_token || ''
      };
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error('Invalid login credentials');
    }
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