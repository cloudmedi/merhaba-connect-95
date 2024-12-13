import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, User } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
      try {
        console.log('Getting initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          throw error;
        }

        if (session?.user && mounted) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error('Profile fetch error:', profileError);
            throw profileError;
          }

          if (profile && mounted) {
            console.log('Profile loaded:', profile);
            setUser({
              id: session.user.id,
              email: session.user.email!,
              firstName: profile.first_name || '',
              lastName: profile.last_name || '',
              role: profile.role as 'super_admin' | 'manager' | 'admin',
              isActive: profile.is_active,
              createdAt: session.user.created_at,
              updatedAt: profile.updated_at || session.user.created_at,
              avatar_url: profile.avatar_url
            });
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);

      if (event === 'SIGNED_IN' && session?.user && mounted) {
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) throw profileError;

          if (profile && mounted) {
            setUser({
              id: session.user.id,
              email: session.user.email!,
              firstName: profile.first_name || '',
              lastName: profile.last_name || '',
              role: profile.role as 'super_admin' | 'manager' | 'admin',
              isActive: profile.is_active,
              createdAt: session.user.created_at,
              updatedAt: profile.updated_at || session.user.created_at,
              avatar_url: profile.avatar_url
            });
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setUser(null);
        }
      } else if (event === 'SIGNED_OUT' && mounted) {
        console.log('User signed out');
        setUser(null);
      }

      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

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

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}