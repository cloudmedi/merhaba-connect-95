import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function SuperAdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setIsLoading(true);
      console.log('Auth state changed:', event, session?.user?.id);

      if (session?.user) {
        try {
          // First check if the profile exists
          const { data: profileExists, error: checkError } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', session.user.id)
            .maybeSingle();

          if (checkError) {
            console.error('Error checking profile:', checkError);
            throw checkError;
          }

          // If profile doesn't exist, create it
          if (!profileExists) {
            const { error: insertError } = await supabase
              .from('profiles')
              .insert([
                {
                  id: session.user.id,
                  email: session.user.email,
                  role: 'super_admin',
                  is_active: true
                }
              ]);

            if (insertError) {
              console.error('Error creating profile:', insertError);
              throw insertError;
            }
          }

          // Now fetch the complete profile
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error('Error fetching profile:', error);
            throw error;
          }

          if (profile && profile.role === 'super_admin') {
            setUser({
              id: session.user.id,
              email: session.user.email!,
              role: profile.role,
              firstName: profile.first_name,
              lastName: profile.last_name,
              isActive: profile.is_active,
              createdAt: session.user.created_at,
              updatedAt: profile.updated_at || session.user.created_at,
              avatar_url: profile.avatar_url
            });
          } else {
            console.log('User is not a super admin, signing out');
            await supabase.auth.signOut();
            setUser(null);
          }
        } catch (error) {
          console.error('Error in auth state change:', error);
          await supabase.auth.signOut();
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

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('Attempting to sign in:', email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Check if profile exists, create if it doesn't
        const { data: existingProfile, error: checkError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();

        if (checkError) {
          console.error('Error checking profile:', checkError);
          throw new Error('Failed to check user profile');
        }

        if (!existingProfile) {
          const { error: createError } = await supabase
            .from('profiles')
            .insert([
              {
                id: data.user.id,
                email: data.user.email,
                role: 'super_admin',
                is_active: true
              }
            ]);

          if (createError) {
            console.error('Error creating profile:', createError);
            throw new Error('Failed to create user profile');
          }
        }

        // Verify the role
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          console.error('Profile fetch error:', profileError);
          throw new Error('Failed to fetch user profile');
        }

        if (!profile || profile.role !== 'super_admin') {
          console.error('User is not a super admin');
          await supabase.auth.signOut();
          throw new Error('Unauthorized: Super Admin access required');
        }

        toast.success('Login successful');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      toast.success('Logged out successfully');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
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
    throw new Error('useAuth must be used within a SuperAdminAuthProvider');
  }
  return context;
}