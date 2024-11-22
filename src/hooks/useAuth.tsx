import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/auth';
import { authService } from '@/services/auth';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            setUser({
              id: session.user.id,
              email: session.user.email!,
              firstName: profile.first_name,
              lastName: profile.last_name,
              role: profile.role,
              companyId: profile.company_id,
              isActive: profile.is_active,
              avatar_url: profile.avatar_url,
              createdAt: session.user.created_at,
              updatedAt: profile.updated_at
            });
          }
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            firstName: profile.first_name,
            lastName: profile.last_name,
            role: profile.role,
            companyId: profile.company_id,
            isActive: profile.is_active,
            avatar_url: profile.avatar_url,
            createdAt: session.user.created_at,
            updatedAt: profile.updated_at
          });
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      authService.setToken(response.token);
      setUser(response.user);
      
      toast.success('Giriş başarılı');
      
      if (response.user.role === 'super_admin') {
        window.location.href = '/super-admin';
      } else {
        window.location.href = '/manager';
      }
    } catch (error) {
      toast.error('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      
      const isManagerPath = window.location.pathname.startsWith('/manager');
      if (isManagerPath) {
        window.location.href = '/manager/login';
      } else {
        window.location.href = '/super-admin/login';
      }
      
      toast.success('Çıkış yapıldı');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Çıkış yapılırken bir hata oluştu');
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