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
    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Initial session:', session);
        
        if (session?.user) {
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
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error getting session:', error);
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('Auth state changed:', _event, session);
      
      if (session?.user) {
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
        setUser(null);
        // Redirect to login if no session
        const currentPath = window.location.pathname;
        if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
          navigate('/manager/login');
        }
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const login = async (email: string, password: string) => {
    try {
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
        
        toast.success('Login successful');
        
        // Role'e göre yönlendirme
        if (data.user.user_metadata.role === 'super_admin') {
          navigate('/super-admin');
        } else {
          navigate('/manager');
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed');
      throw error;
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
      
      toast.success('Logged out successfully');
    } catch (error: any) {
      console.error('Logout failed:', error);
      toast.error('Failed to log out');
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