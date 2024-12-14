import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserRole } from '@/types/auth';

export function useAuthActions(setUser: (user: any) => void) {
  const login = async (email: string, password: string, expectedRole: UserRole) => {
    try {
      console.log(`Attempting ${expectedRole} login for:`, email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          console.error('Profile fetch error:', profileError);
          throw new Error('Failed to fetch user profile');
        }

        if (!profile) {
          await supabase.auth.signOut();
          throw new Error('User profile not found');
        }

        // Verify role matches
        if (profile.role !== expectedRole) {
          await supabase.auth.signOut();
          throw new Error(`Unauthorized access: ${expectedRole} privileges required`);
        }

        setUser({
          id: data.user.id,
          email: data.user.email!,
          firstName: profile.first_name || '',
          lastName: profile.last_name || '',
          role: profile.role,
          isActive: profile.is_active,
          createdAt: data.user.created_at,
          updatedAt: profile.updated_at,
          avatar_url: profile.avatar_url
        });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error: any) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return { login, logout };
}