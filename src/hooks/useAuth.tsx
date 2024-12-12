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

    // Initial session check
    const checkSession = async () => {
      try {
        console.log('Checking initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error.message);
          return;
        }

        if (session?.user && mounted) {
          console.log('Found existing session:', session.user.id);
          setUser({
            id: session.user.id,
            email: session.user.email!,
            firstName: session.user.user_metadata?.firstName || '',
            lastName: session.user.user_metadata?.lastName || '',
            role: session.user.user_metadata?.role || 'manager',
            isActive: true,
            createdAt: session.user.created_at,
            updatedAt: session.user.updated_at || session.user.created_at
          });

          // Redirect based on role if on login page
          const currentPath = window.location.pathname;
          if (currentPath.includes('/login')) {
            const redirectPath = session.user.user_metadata?.role === 'super_admin' 
              ? '/super-admin' 
              : '/manager';
            navigate(redirectPath);
          }
        } else {
          console.log('No active session found during initial check');
          setUser(null);
          
          // Only redirect to login if not already on a login/register page
          const currentPath = window.location.pathname;
          if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
            navigate('/manager/login');
          }
        }
      } catch (error) {
        console.error('Session check failed:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);

      if (session?.user && mounted) {
        console.log('Setting user from auth change:', session.user.id);
        setUser({
          id: session.user.id,
          email: session.user.email!,
          firstName: session.user.user_metadata?.firstName || '',
          lastName: session.user.user_metadata?.lastName || '',
          role: session.user.user_metadata?.role || 'manager',
          isActive: true,
          createdAt: session.user.created_at,
          updatedAt: session.user.updated_at || session.user.created_at
        });

        if (event === 'SIGNED_IN') {
          const redirectPath = session.user.user_metadata?.role === 'super_admin' 
            ? '/super-admin' 
            : '/manager';
          navigate(redirectPath);
        }
      } else if (!session && mounted) {
        console.log('No session in auth change, clearing user');
        setUser(null);
        
        // Only redirect to login if not already on a login/register page
        const currentPath = window.location.pathname;
        if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
          navigate('/manager/login');
        }
      }
    });

    // Initial session check
    checkSession();

    // Cleanup
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('Attempting login for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error);
        toast.error(error.message || 'Giriş başarısız');
        throw error;
      }

      if (data.user) {
        console.log('Login successful:', data.user.id);
        setUser({
          id: data.user.id,
          email: data.user.email!,
          firstName: data.user.user_metadata?.firstName || '',
          lastName: data.user.user_metadata?.lastName || '',
          role: data.user.user_metadata?.role || 'manager',
          isActive: true,
          createdAt: data.user.created_at,
          updatedAt: data.user.updated_at || data.user.created_at
        });
        
        toast.success('Giriş başarılı');
        
        // Redirect based on role
        const redirectPath = data.user.user_metadata?.role === 'super_admin' 
          ? '/super-admin' 
          : '/manager';
        navigate(redirectPath);
      }
    } catch (error: any) {
      console.error('Login process failed:', error);
      toast.error(error.message || 'Giriş işlemi başarısız');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      toast.success('Başarıyla çıkış yapıldı');
      
      // Redirect based on current path
      const isManagerPath = window.location.pathname.startsWith('/manager');
      navigate(isManagerPath ? '/manager/login' : '/super-admin/login');
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