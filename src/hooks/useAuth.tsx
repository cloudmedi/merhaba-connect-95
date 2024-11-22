import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/auth';
import { authService } from '@/services/auth';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*, companies (*)')
            .eq('id', session.user.id)
            .single();

          if (profileError || !profile) {
            console.error('Profile fetch error:', profileError);
            await supabase.auth.signOut();
            setIsLoading(false);
            return;
          }

          if (!profile.is_active) {
            await supabase.auth.signOut();
            toast.error('Your account has been deactivated');
            setIsLoading(false);
            return;
          }

          setUser({
            id: session.user.id,
            email: session.user.email!,
            firstName: profile.first_name || '',
            lastName: profile.last_name || '',
            role: profile.role as "super_admin" | "manager" | "admin",
            companyId: profile.company_id,
            isActive: profile.is_active,
            createdAt: session.user.created_at,
            updatedAt: profile.updated_at || session.user.created_at,
            company: profile.companies ? {
              id: profile.companies.id,
              name: profile.companies.name,
              subscriptionStatus: profile.companies.subscription_status,
              subscriptionEndsAt: profile.companies.subscription_ends_at
            } : undefined
          });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        await supabase.auth.signOut();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        navigate('/');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      setUser(response.user);
      authService.setToken(response.token);
      
      toast.success('Login successful');
      
      if (response.user.role === 'super_admin') {
        navigate('/super-admin');
      } else if (response.user.role === 'manager') {
        navigate('/manager');
      } else {
        navigate('/manager'); // Default to manager for other roles
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      navigate('/');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
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