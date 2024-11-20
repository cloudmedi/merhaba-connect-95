import { supabase } from '@/integrations/supabase/client';

export const getUsersQuery = async (filters?: {
  search?: string;
  role?: string;
  status?: string;
  license?: string;
  expiry?: string;
}) => {
  let query = supabase
    .from('profiles')
    .select(`
      *,
      companies (
        id,
        name,
        subscription_status,
        subscription_ends_at
      ),
      licenses (
        type,
        start_date,
        end_date,
        quantity
      )
    `);

  if (filters?.search) {
    query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
  }

  if (filters?.role) {
    query = query.eq('role', filters.role);
  }

  if (filters?.status) {
    query = query.eq('is_active', filters.status === 'active');
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const getUserById = async (id: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      companies (
        id,
        name,
        subscription_status,
        subscription_ends_at
      ),
      licenses (
        type,
        start_date,
        end_date,
        quantity
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};