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
            console.log('Creating new profile for user:', session.user.id);
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
              role: profile.role as UserRole,
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

  return { user, isLoading };
}