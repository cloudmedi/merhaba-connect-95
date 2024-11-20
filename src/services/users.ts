import { supabase } from './supabase';
import { User } from '@/types/auth';

export const userService = {
  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data: authUser, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: 'temp123!', // Geçici şifre, kullanıcıya email ile gönderilecek
      options: {
        data: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: 'manager',
          companyId: userData.companyId,
        }
      }
    });

    if (authError) throw authError;

    const { data, error } = await supabase
      .from('users')
      .insert({
        id: authUser.user!.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: 'manager',
        companyId: userData.companyId,
        isActive: true
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getUsers(filters?: {
    search?: string;
    role?: string;
    status?: string;
    license?: string;
    expiry?: string;
  }) {
    let query = supabase
      .from('users')
      .select(`
        *,
        companies (
          id,
          name,
          subscriptionStatus,
          subscriptionEndsAt
        )
      `)
      .eq('role', 'manager');

    if (filters?.search) {
      query = query.or(`
        firstName.ilike.%${filters.search}%,
        lastName.ilike.%${filters.search}%,
        email.ilike.%${filters.search}%,
        companies.name.ilike.%${filters.search}%
      `);
    }

    if (filters?.status) {
      query = query.eq('isActive', filters.status === 'active');
    }

    if (filters?.license) {
      query = query.eq('companies.subscriptionStatus', filters.license);
    }

    if (filters?.expiry) {
      const today = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(today.getDate() + 30);

      switch (filters.expiry) {
        case 'this-month':
          query = query.and(`subscriptionEndsAt.gte.${today.toISOString()},subscriptionEndsAt.lte.${thirtyDaysFromNow.toISOString()}`);
          break;
        case 'expired':
          query = query.lt('subscriptionEndsAt', today.toISOString());
          break;
      }
    }

    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  }
};
