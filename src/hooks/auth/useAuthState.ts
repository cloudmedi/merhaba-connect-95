import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole } from '@/types/auth';
import { toast } from 'sonner';

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setIsLoading(true);

      if (session?.user) {
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*, companies(*)')
            .eq('id', session.user.id)
            .single();

          if (error) throw error;

          if (profile) {
            const userRole = profile.role as UserRole;
            if (userRole !== 'super_admin' && userRole !== 'manager') {
              throw new Error('Invalid user role');
            }

            setUser({
              id: session.user.id,
              email: session.user.email!,
              role: userRole,
              firstName: profile.first_name,
              lastName: profile.last_name,
              isActive: profile.is_active,
              createdAt: session.user.created_at,
              updatedAt: profile.updated_at || session.user.created_at,
              avatar_url: profile.avatar_url,
              companyId: profile.company_id,
              company: profile.companies
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
          .select('*, companies(*)')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile, error }) => {
            if (error) {
              console.error('Error fetching profile:', error);
              setUser(null);
            } else if (profile) {
              const userRole = profile.role as UserRole;
              if (userRole !== 'super_admin' && userRole !== 'manager') {
                console.error('Invalid user role');
                setUser(null);
                return;
              }

              setUser({
                id: session.user.id,
                email: session.user.email!,
                role: userRole,
                firstName: profile.first_name,
                lastName: profile.last_name,
                isActive: profile.is_active,
                createdAt: session.user.created_at,
                updatedAt: profile.updated_at || session.user.created_at,
                avatar_url: profile.avatar_url,
                companyId: profile.company_id,
                company: profile.companies
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

  return { user, isLoading };
}