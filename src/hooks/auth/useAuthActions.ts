import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useAuthActions(setUser: (user: any) => void) {
  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.user) {
        // First check if profile exists
        const { data: existingProfile, error: checkError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();

        if (checkError) throw checkError;

        // If profile doesn't exist, create it
        if (!existingProfile) {
          console.log('Creating new profile for user:', data.user.id);
          const { error: insertError } = await supabase
            .from('profiles')
            .insert([
              {
                id: data.user.id,
                email: data.user.email,
                role: 'super_admin',
                is_active: true
              }
            ]);

          if (insertError) throw insertError;
          
          // Wait a bit for the database to update
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Now fetch the complete profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();

        if (profileError) throw profileError;

        if (profile && profile.role === 'super_admin') {
          setUser({
            id: data.user.id,
            email: data.user.email!,
            firstName: profile.first_name || '',
            lastName: profile.last_name || '',
            role: profile.role,
            isActive: profile.is_active,
            createdAt: data.user.created_at,
            updatedAt: profile.updated_at || data.user.created_at,
            avatar_url: profile.avatar_url
          });
          
          toast.success('Login successful');
        } else {
          await supabase.auth.signOut();
          throw new Error('Unauthorized access: Super admin privileges required');
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Login failed: ' + error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('Attempting logout...');
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
  };

  return { login, logout };
}