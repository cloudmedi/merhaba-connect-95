import { AuthResponse, LoginCredentials } from "@/types/auth";
import { supabase } from '@/integrations/supabase/client';

export const authService = {
  async login({ email, password }: LoginCredentials): Promise<AuthResponse> {
    try {
      // First attempt to sign in with Supabase
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        console.error('Supabase signin error:', signInError);
        throw new Error('Invalid email or password');
      }

      if (!authData.user || !authData.session) {
        throw new Error('Login failed - no user data returned');
      }

      // Fetch the user's profile data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*, companies (*)')
        .eq('id', authData.user.id)
        .single();

      if (profileError || !profile) {
        console.error('Profile fetch error:', profileError);
        await supabase.auth.signOut();
        throw new Error('User profile not found');
      }

      if (!profile.is_active) {
        await supabase.auth.signOut();
        throw new Error('Your account has been deactivated');
      }

      // Validate role type
      const validRoles = ["super_admin", "manager", "admin"] as const;
      if (!validRoles.includes(profile.role as any)) {
        await supabase.auth.signOut();
        throw new Error('Invalid user role');
      }

      // For manager role, ensure they have a company assigned
      if (profile.role === 'manager' && !profile.company_id) {
        await supabase.auth.signOut();
        throw new Error('Manager account not properly configured - no company assigned');
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
        token: authData.session.access_token
      };
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      localStorage.removeItem('token');
    } catch (error: any) {
      console.error('Logout error:', error);
      throw new Error('Logout failed');
    }
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