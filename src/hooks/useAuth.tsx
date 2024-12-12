import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
      try {
        setIsLoading(true);
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error fetching initial session:', error.message);
          return;
        }

        console.log('Initial session check:', session);

        if (mounted) {
          if (session?.user) {
            console.log('Setting initial user:', session.user);
            setUser({
              id: session.user.id,
              email: session.user.email!,
              firstName: session.user.user_metadata.firstName || '',
              lastName: session.user.user_metadata.lastName || '',
              role: session.user.user_metadata.role || 'manager',
              isActive: true,
              createdAt: session.user.created_at,
              updatedAt: session.user.updated_at || session.user.created_at
            });
          } else {
            console.log('No initial session found');
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Session initialization error:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);

      if (session?.user && mounted) {
        console.log('Setting user from auth change:', session.user);
        setUser({
          id: session.user.id,
          email: session.user.email!,
          firstName: session.user.user_metadata.firstName || '',
          lastName: session.user.user_metadata.lastName || '',
          role: session.user.user_metadata.role || 'manager',
          isActive: true,
          createdAt: session.user.created_at,
          updatedAt: session.user.updated_at || session.user.created_at
        });

        if (event === 'SIGNED_IN') {
          // Role'e göre yönlendirme
          if (session.user.user_metadata.role === 'super_admin') {
            navigate('/super-admin');
          } else {
            navigate('/manager');
          }
        }
      } else if (!session && mounted) {
        console.log('No session in auth change');
        setUser(null);
        const currentPath = window.location.pathname;
        if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
          navigate('/manager/login');
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('Attempting login with:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error);
        toast.error(error.message);
        throw error;
      }

      if (data.user) {
        console.log('Login successful:', data.user);
        setUser({
          id: data.user.id,
          email: data.user.email!,
          firstName: data.user.user_metadata.firstName || '',
          lastName: data.user.user_metadata.lastName || '',
          role: data.user.user_metadata.role || 'manager',
          isActive: true,
          createdAt: data.user.created_at,
          updatedAt: data.user.updated_at || data.user.created_at
        });
        
        toast.success('Giriş başarılı');
        
        // Role'e göre yönlendirme
        if (data.user.user_metadata.role === 'super_admin') {
          navigate('/super-admin');
        } else {
          navigate('/manager');
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Giriş başarısız');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      
      // Redirect based on current path
      const isManagerPath = window.location.pathname.startsWith('/manager');
      if (isManagerPath) {
        navigate('/manager/login');
      } else {
        navigate('/super-admin/login');
      }
      
      toast.success('Başarıyla çıkış yapıldı');
    } catch (error: any) {
      console.error('Logout failed:', error);
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