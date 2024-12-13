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
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) throw profileError;

        if (profile) {
          console.log('Profile loaded:', profile);
          setUser({
            id: data.user.id,
            email: data.user.email!,
            firstName: profile.first_name || '',
            lastName: profile.last_name || '',
            role: profile.role as 'super_admin' | 'manager' | 'admin',
            isActive: profile.is_active,
            createdAt: data.user.created_at,
            updatedAt: profile.updated_at || data.user.created_at,
            avatar_url: profile.avatar_url
          });
          
          toast.success('Giriş başarılı');
          
          if (profile.role === 'super_admin') {
            window.location.href = '/super-admin';
          } else {
            window.location.href = '/manager';
          }
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Giriş başarısız: ' + error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('Attempting logout...');
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      
      const isManagerPath = window.location.pathname.startsWith('/manager');
      window.location.href = isManagerPath ? '/manager/login' : '/super-admin/login';
      
      toast.success('Çıkış başarılı');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error('Çıkış yapılamadı');
    }
  };

  return { login, logout };
}