import { AuthResponse, LoginCredentials } from "@/types/auth";
import { supabase } from '@/integrations/supabase/client';

export const authService = {
  async login({ email, password }: LoginCredentials): Promise<AuthResponse> {
    try {
      const { data: { user, session }, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (!user || !session) {
        throw new Error('Login failed');
      }

      // Check if the user profile exists and is active
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*, companies (*)')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        // If profile doesn't exist, sign out the user and throw error
        await supabase.auth.signOut();
        throw new Error('User account has been deleted or deactivated');
      }

      if (!profile.is_active) {
        await supabase.auth.signOut();
        throw new Error('Your account has been deactivated');
      }

      // Validate role type
      if (!isValidRole(profile.role)) {
        await supabase.auth.signOut();
        throw new Error('Invalid user role');
      }

      return {
        user: {
          id: user.id,
          email: user.email!,
          firstName: profile.first_name || '',
          lastName: profile.last_name || '',
          role: profile.role as "super_admin" | "manager" | "admin",
          companyId: profile.company_id,
          isActive: profile.is_active,
          createdAt: user.created_at,
          updatedAt: profile.updated_at || user.created_at,
          company: profile.companies ? {
            id: profile.companies.id,
            name: profile.companies.name,
            subscriptionStatus: profile.companies.subscription_status,
            subscriptionEndsAt: profile.companies.subscription_ends_at
          } : undefined
        },
        token: session.access_token
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
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

// Helper function to validate role
function isValidRole(role: string): role is "super_admin" | "manager" | "admin" {
  return ["super_admin", "manager", "admin"].includes(role);
}