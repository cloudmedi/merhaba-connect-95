import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          first_name,
          last_name,
          role,
          is_active,
          created_at,
          updated_at,
          company_id,
          companies (
            id,
            name,
            subscription_status,
            subscription_ends_at
          )
        `)
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Profil getirme hatası:', error);
        throw error;
      }

      if (!profile) {
        console.error('Kullanıcı profili bulunamadı:', userId);
        throw new Error('Kullanıcı profili bulunamadı');
      }

      return {
        id: profile.id,
        email: profile.email,
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        role: profile.role as 'super_admin' | 'manager' | 'admin',
        isActive: profile.is_active,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at,
        companyId: profile.company_id,
        company: profile.companies ? {
          id: profile.companies.id,
          name: profile.companies.name,
          subscriptionStatus: profile.companies.subscription_status,
          subscriptionEndsAt: profile.companies.subscription_ends_at
        } : undefined
      };
    } catch (error) {
      console.error('fetchUserProfile hatası:', error);
      throw error;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id);
          setUser(profile);
        }
      } catch (error) {
        console.error('Auth başlatma hatası:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        try {
          const profile = await fetchUserProfile(session.user.id);
          setUser(profile);
        } catch (error) {
          console.error('Profil güncelleme hatası:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.user) {
        const profile = await fetchUserProfile(data.user.id);
        
        if (!profile.isActive) {
          throw new Error('Hesabınız şu anda aktif değil. Lütfen yöneticinizle iletişime geçin.');
        }

        setUser(profile);
        toast.success('Giriş başarılı');
        
        if (profile.role === 'super_admin') {
          window.location.href = '/super-admin/users';
        } else if (profile.role === 'manager' || profile.role === 'admin') {
          window.location.href = '/manager';
        }
      }
    } catch (error: any) {
      console.error('Giriş hatası:', error);
      toast.error(error.message || 'Giriş yapılamadı');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      
      const isManagerPath = window.location.pathname.startsWith('/manager');
      if (isManagerPath) {
        window.location.href = '/manager/login';
      } else {
        window.location.href = '/super-admin/login';
      }
      
      toast.success('Başarıyla çıkış yapıldı');
    } catch (error: any) {
      console.error('Çıkış hatası:', error);
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