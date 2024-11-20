import { supabase } from '@/integrations/supabase/client';

export const getUsersQuery = (filters?: {
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
      companies!profiles_company_id_fkey (
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
    .eq('role', 'manager');

  if (filters?.search) {
    query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
  }

  if (filters?.status) {
    query = query.eq('is_active', filters.status === 'active');
  }

  if (filters?.license) {
    query = query.eq('companies.subscription_status', filters.license);
  }

  if (filters?.expiry) {
    const today = new Date().toISOString();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    const futureDate = thirtyDaysFromNow.toISOString();

    if (filters.expiry === 'this-month') {
      query = query
        .gte('companies.subscription_ends_at', today)
        .lte('companies.subscription_ends_at', futureDate);
    } else if (filters.expiry === 'expired') {
      query = query.lt('companies.subscription_ends_at', today);
    }
  }

  return query;
};