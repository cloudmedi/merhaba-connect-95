import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '@/types/auth';
import { useAuthState } from '@/hooks/auth/useAuthState';
import { useAuthActions } from '@/hooks/auth/useAuthActions';
import { AuthContextType } from '@/hooks/auth/types';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const ManagerAuthContext = createContext<AuthContextType | undefined>(undefined);

export function ManagerAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const { user: authUser, isLoading } = useAuthState();
  const { login: baseLogin, logout: baseLogout } = useAuthActions(setUser);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize auth state
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
              first_name: profile.first_name || '',
              last_name: profile.last_name || '',
              role: profile.role,
              is_active: profile.is_active,
              created_at: session.user.created_at,
              updated_at: profile.updated_at,
              avatar_url: profile.avatar_url,
              company_id: profile.company_id,
              // Aliases
              firstName: profile.first_name || '',
              lastName: profile.last_name || '',
              isActive: profile.is_active,
              createdAt: session.user.created_at,
              updatedAt: profile.updated_at,
              companyId: profile.company_id
            });
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setUser(null);
      }
    };

    initAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_OUT') {
        setUser(null);
        navigate('/manager/login');
      } else if (session?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            setUser({
              id: session.user.id,
              email: session.user.email!,
              first_name: profile.first_name || '',
              last_name: profile.last_name || '',
              role: profile.role,
              is_active: profile.is_active,
              created_at: session.user.created_at,
              updated_at: profile.updated_at,
              avatar_url: profile.avatar_url,
              company_id: profile.company_id,
              // Aliases
              firstName: profile.first_name || '',
              lastName: profile.last_name || '',
              isActive: profile.is_active,
              createdAt: session.user.created_at,
              updatedAt: profile.updated_at,
              companyId: profile.company_id
            });
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setUser(null);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  // Sync user state with auth state
  useEffect(() => {
    if (user !== authUser) {
      setUser(authUser);
    }
  }, [authUser, user]);

  const login = async (email: string, password: string) => {
    try {
      await baseLogin(email, password, 'manager');
      navigate('/manager');
      toast.success('Login successful');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await baseLogout();
      navigate('/manager/login');
      toast.success('Logged out successfully');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
  };

  return (
    <ManagerAuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </ManagerAuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(ManagerAuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a ManagerAuthProvider');
  }
  return context;
}