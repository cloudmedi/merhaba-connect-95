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

  // Function to fetch and set user profile
  const fetchAndSetUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (profile) {
        setUser({
          id: userId,
          email: profile.email,
          firstName: profile.first_name,
          lastName: profile.last_name,
          role: profile.role as 'super_admin' | 'manager' | 'admin',
          isActive: profile.is_active,
          companyId: profile.company_id,
          createdAt: profile.created_at,
          updatedAt: profile.updated_at
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUser(null);
    }
  };

  useEffect(() => {
    // Initial session check
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id) {
          await fetchAndSetUserProfile(session.user.id);
        }
      } catch (error) {
        console.error('Session check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user?.id) {
        await fetchAndSetUserProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data: { user: authUser }, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) throw signInError;
      if (!authUser?.id) throw new Error('No user returned after login');

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profileError) throw profileError;
      if (!profile.is_active) throw new Error('Account is inactive');

      setUser({
        id: authUser.id,
        email: authUser.email!,
        firstName: profile.first_name,
        lastName: profile.last_name,
        role: profile.role as 'super_admin' | 'manager' | 'admin',
        isActive: profile.is_active,
        companyId: profile.company_id,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at
      });

      toast.success('Login successful');

      if (profile.role === 'super_admin') {
        window.location.href = '/super-admin';
      } else {
        window.location.href = '/manager';
      }
    } catch (error: any) {
      toast.error('Login failed: ' + error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      window.location.href = '/';
      toast.success('Logged out successfully');
    } catch (error: any) {
      console.error('Logout failed:', error);
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