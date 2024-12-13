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
        // First check if profile exists
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
          // Create profile with expected role if it doesn't exist
          const { error: insertError } = await supabase
            .from('profiles')
            .insert([{
              id: data.user.id,
              email: data.user.email,
              role: expectedRole,
              is_active: true
            }]);

          if (insertError) throw insertError;
          
          // Fetch the newly created profile
          const { data: newProfile, error: newProfileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (newProfileError) throw newProfileError;
          
          if (newProfile.role !== expectedRole) {
            await supabase.auth.signOut();
            throw new Error(`Unauthorized access: ${expectedRole} privileges required`);
          }

          setUser({
            id: data.user.id,
            email: data.user.email!,
            role: newProfile.role,
            isActive: newProfile.is_active,
            createdAt: data.user.created_at,
            updatedAt: newProfile.updated_at
          });
        } else {
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