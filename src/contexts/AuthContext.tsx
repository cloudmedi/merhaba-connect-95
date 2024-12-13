import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User, UserRole } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      setIsLoading(true);

      if (session?.user) {
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (error) throw error;

          if (profile) {
            const userRole = profile.role as UserRole;
            setUser({
              id: session.user.id,
              email: session.user.email!,
              role: userRole,
              firstName: profile.first_name,
              lastName: profile.last_name,
              isActive: profile.is_active,
              createdAt: session.user.created_at,
              updatedAt: profile.updated_at || session.user.created_at,
              avatar_url: profile.avatar_url
            });
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }

      setIsLoading(false);
    });

    // Initial session check
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error checking session:', error);
        setIsLoading(false);
        return;
      }

      if (session?.user) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile, error }) => {
            if (error) {
              console.error('Error fetching profile:', error);
              setUser(null);
            } else if (profile) {
              const userRole = profile.role as UserRole;
              setUser({
                id: session.user.id,
                email: session.user.email!,
                role: userRole,
                firstName: profile.first_name,
                lastName: profile.last_name,
                isActive: profile.is_active,
                createdAt: session.user.created_at,
                updatedAt: profile.updated_at || session.user.created_at,
                avatar_url: profile.avatar_url
              });
            }
            setIsLoading(false);
          });
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) throw profileError;

        if (profile.role !== 'super_admin') {
          await supabase.auth.signOut();
          throw new Error('Unauthorized access');
        }

        toast.success('Giriş başarılı');
      }
    } catch (error: any) {
      toast.error(error.message || 'Giriş başarısız');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      toast.success('Çıkış başarılı');
    } catch (error: any) {
      toast.error('Çıkış yapılamadı');
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
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