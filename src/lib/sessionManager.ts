import { supabase } from "@/integrations/supabase/client";
import { User, UserRole } from "@/types/auth";
import { toast } from "sonner";

export async function getInitialSession() {
  try {
    console.log('Getting initial session...');
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Session error:', error);
      throw error;
    }

    if (session?.user) {
      console.log('Found existing session:', session.user.id);
      const user = await getUserProfile(session.user.id);
      return { session, user };
    }

    console.log('No session found');
    return { session: null, user: null };
  } catch (error) {
    console.error('Error getting initial session:', error);
    return { session: null, user: null };
  }
}

export async function getUserProfile(userId: string): Promise<User | null> {
  try {
    console.log('Fetching user profile:', userId);
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Profile fetch error:', error);
      throw error;
    }

    if (!profile) {
      console.log('No profile found for user:', userId);
      return null;
    }

    console.log('Profile loaded:', profile);
    return {
      id: profile.id,
      email: profile.email,
      firstName: profile.first_name || '',
      lastName: profile.last_name || '',
      role: profile.role as UserRole,
      isActive: profile.is_active,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at,
      avatar_url: profile.avatar_url
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

export async function handleAuthStateChange(event: string, session: any) {
  console.log('Auth state changed:', event, session?.user?.id);
  
  if (event === 'SIGNED_IN' && session?.user) {
    try {
      const user = await getUserProfile(session.user.id);
      return user;
    } catch (error) {
      console.error('Error handling auth state change:', error);
      return null;
    }
  }
  
  return null;
}