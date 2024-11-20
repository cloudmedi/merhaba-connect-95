import { supabase } from './supabase';
import { User, CreateUserData } from '@/types/auth';
import { companyService } from './company';
import { licenseService } from './license';

export const userService = {
  async getUsers(filters?: {
    search?: string;
    role?: string;
    status?: string;
    license?: string;
    expiry?: string;
  }) {
    let query = supabase
      .from('users')
      .select('*, company:company_id(id, name, subscription_status, subscription_ends_at)')
      .eq('role', 'manager');

    if (filters?.search) {
      query = query.or(`firstName.ilike.%${filters.search}%,lastName.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
    }

    if (filters?.status) {
      query = query.eq('is_active', filters.status === 'active');
    }

    if (filters?.license) {
      query = query.eq('company.subscription_status', filters.license);
    }

    if (filters?.expiry) {
      const today = new Date().toISOString();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      const futureDate = thirtyDaysFromNow.toISOString();

      if (filters.expiry === 'this-month') {
        query = query.gte('company.subscription_ends_at', today)
                    .lte('company.subscription_ends_at', futureDate);
      } else if (filters.expiry === 'expired') {
        query = query.lt('company.subscription_ends_at', today);
      }
    }

    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  },

  async createUser(userData: CreateUserData) {
    // 1. Create company
    const company = await companyService.createCompany({
      name: userData.companyName,
      subscriptionStatus: userData.license.type,
      subscriptionEndsAt: userData.license.endDate,
    });

    // 2. Create Supabase auth user
    const { data: authUser, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: 'temp123!',
      options: {
        data: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role,
          companyId: company.id,
        }
      }
    });

    if (authError) throw authError;

    // 3. Create user record in users table
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        id: authUser.user!.id,
        email: userData.email,
        first_name: userData.firstName,
        last_name: userData.lastName,
        role: userData.role,
        company_id: company.id,
        company_name: userData.companyName,
        is_active: true
      })
      .select()
      .single();

    if (userError) throw userError;

    // 4. Create license record
    await licenseService.createLicense({
      userId: user.id,
      type: userData.license.type,
      startDate: userData.license.startDate,
      endDate: userData.license.endDate,
      quantity: userData.license.quantity
    });

    return user;
  },

  async updateUser(id: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteUser(id: string) {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async toggleUserStatus(id: string, isActive: boolean) {
    const { data, error } = await supabase
      .from('users')
      .update({ isActive })
      .eq('id', id)
      .select('*')
      .single();
    
    if (error) throw error;
    return data;
  },

  async renewLicense(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .update({ 
        license: 'premium',
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
      })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};
