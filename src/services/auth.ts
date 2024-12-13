import { supabase } from '@/integrations/supabase/client';
import { LoginCredentials, User, UserRole } from '@/types/auth';

export async function signIn({ email, password }: LoginCredentials) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser(): Promise<User | null> {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error || !session?.user) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*, companies(*)')
    .eq('id', session.user.id)
    .single();

  if (profileError || !profile) {
    return null;
  }

  const userRole = profile.role as UserRole;
  if (userRole !== 'super_admin' && userRole !== 'manager') {
    return null;
  }

  return {
    id: session.user.id,
    email: session.user.email!,
    firstName: profile.first_name,
    lastName: profile.last_name,
    role: userRole,
    isActive: profile.is_active,
    createdAt: session.user.created_at,
    updatedAt: profile.updated_at,
    avatar_url: profile.avatar_url,
    companyId: profile.company_id,
    company: profile.companies
  };
}