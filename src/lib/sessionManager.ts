import { User, UserRole } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';

export async function getSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    if (!session) return null;

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select(`
        *,
        companies (
          id,
          name,
          subscription_status,
          subscription_ends_at
        )
      `)
      .eq('id', session.user.id)
      .single();

    if (profileError) throw profileError;
    if (!profile) return null;

    const userRole = profile.role as UserRole;

    return {
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
    } as User;
  } catch (error) {
    console.error('Session error:', error);
    return null;
  }
}