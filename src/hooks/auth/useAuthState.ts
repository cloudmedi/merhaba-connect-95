import { useState, useEffect } from 'react';
import { User } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
      try {
        console.log('Getting initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          throw error;
        }

        if (session?.user && mounted) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error('Profile fetch error:', profileError);
            throw profileError;
          }

          if (profile && mounted) {
            console.log('Profile loaded:', profile);
            setUser({
              id: session.user.id,
              email: session.user.email!,
              firstName: profile.first_name || '',
              lastName: profile.last_name || '',
              role: profile.role as 'super_admin' | 'manager' | 'admin',
              isActive: profile.is_active,
              createdAt: session.user.created_at,
              updatedAt: profile.updated_at || session.user.created_at,
              avatar_url: profile.avatar_url
            });
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);

      if (event === 'SIGNED_IN' && session?.user && mounted) {
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) throw profileError;

          if (profile && mounted) {
            setUser({
              id: session.user.id,
              email: session.user.email!,
              firstName: profile.first_name || '',
              lastName: profile.last_name || '',
              role: profile.role as 'super_admin' | 'manager' | 'admin',
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
      } else if (event === 'SIGNED_OUT' && mounted) {
        console.log('User signed out');
        setUser(null);
      }

      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { user, isLoading, setUser };
}