import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole } from '@/types/auth';

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        if (session?.user && mounted) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) throw profileError;

          if (profile && mounted) {
            const userRole = profile.role as UserRole;
            setUser({
              id: session.user.id,
              email: session.user.email!,
              first_name: profile.first_name || '',
              last_name: profile.last_name || '',
              role: userRole,
              is_active: profile.is_active,
              created_at: session.user.created_at,
              updated_at: profile.updated_at || session.user.created_at,
              avatar_url: profile.avatar_url,
              company_id: profile.company_id,
              // Aliases
              firstName: profile.first_name || '',
              lastName: profile.last_name || '',
              isActive: profile.is_active,
              createdAt: session.user.created_at,
              updatedAt: profile.updated_at || session.user.created_at,
              companyId: profile.company_id
            });
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setUser(null);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user && mounted) {
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) throw profileError;

          if (profile && mounted) {
            const userRole = profile.role as UserRole;
            setUser({
              id: session.user.id,
              email: session.user.email!,
              first_name: profile.first_name || '',
              last_name: profile.last_name || '',
              role: userRole,
              is_active: profile.is_active,
              created_at: session.user.created_at,
              updated_at: profile.updated_at || session.user.created_at,
              avatar_url: profile.avatar_url,
              company_id: profile.company_id,
              // Aliases
              firstName: profile.first_name || '',
              lastName: profile.last_name || '',
              isActive: profile.is_active,
              createdAt: session.user.created_at,
              updatedAt: profile.updated_at || session.user.created_at,
              companyId: profile.company_id
            });
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setUser(null);
        }
      } else if (mounted) {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { user, isLoading };
}