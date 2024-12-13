import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, User } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { getInitialSession, handleAuthStateChange } from '@/lib/sessionManager';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const initializeAuth = async () => {
      try {
        const { user } = await getInitialSession();
        if (mounted) {
          setUser(user);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setUser(null);
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (mounted) {
        const user = await handleAuthStateChange(event, session);
        setUser(user);
        setIsLoading(false);
      }
    });

    return () => {
      setMounted(false);
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('Attempting login for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.user) {
        const user = await handleAuthStateChange('SIGNED_IN', data);
        if (user) {
          setUser(user);
          toast.success('Giriş başarılı');
          
          if (user.role === 'super_admin') {
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
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
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