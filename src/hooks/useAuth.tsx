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

  useEffect(() => {
    // Set up initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
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
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // Refresh the session when signed in
        const { data: { user: refreshedUser } } = await supabase.auth.getUser();
        if (refreshedUser) {
          setUser({
            id: refreshedUser.id,
            email: refreshedUser.email!,
            firstName: refreshedUser.user_metadata.firstName || '',
            lastName: refreshedUser.user_metadata.lastName || '',
            role: refreshedUser.user_metadata.role || 'manager',
            isActive: true,
            createdAt: refreshedUser.created_at,
            updatedAt: refreshedUser.updated_at || refreshedUser.created_at
          });
        }
      } else if (event === 'SIGNED_OUT') {
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
        
        if (data.user.user_metadata.role === 'super_admin') {
          window.location.href = '/super-admin';
        } else {
          window.location.href = '/manager';
        }
      }
    } catch (error: any) {
      toast.error('Login failed: ' + error.message);
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
        window.location.href = '/manager/login';
      } else {
        window.location.href = '/super-admin/login';
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