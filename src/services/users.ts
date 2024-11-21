import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/auth';
import { companyService } from './company';
import { licenseService } from './license';
import { CreateUserFormValues } from '@/pages/SuperAdmin/Users/components/CreateUserForm/types';

export const userService = {
  async getUsers(filters?: {
    search?: string;
    role?: string;
    status?: string;
    license?: string;
    expiry?: string;
  }) {
    let query = supabase
      .from('profiles')
      .select(`
        *,
        companies:company_id (
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

    if (filters?.role && filters?.role !== 'all') {
      query = query.eq('role', filters.role);
    }

    if (filters?.status && filters?.status !== 'all') {
      query = query.eq('is_active', filters.status === 'active');
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async createUser(userData: CreateUserFormValues) {
    // 1. Create company
    const company = await companyService.createCompany({
      name: userData.companyName,
      subscriptionStatus: userData.license.type,
      subscriptionEndsAt: userData.license.end_date,
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

    // 3. Create user record in profiles table
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .insert({
        id: authUser.user!.id,
        email: userData.email,
        first_name: userData.firstName,
        last_name: userData.lastName,
        role: userData.role,
        company_id: company.id,
        is_active: true
      })
      .select()
      .single();

    if (userError) throw userError;

    // 4. Create license record
    await licenseService.createLicense({
      userId: user.id,
      type: userData.license.type,
      start_date: userData.license.start_date,
      end_date: userData.license.end_date,
      quantity: userData.license.quantity
    });

    return user;
  },

  async updateUser(id: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        first_name: updates.firstName,
        last_name: updates.lastName,
        email: updates.email,
        role: updates.role,
        is_active: updates.isActive,
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteUser(id: string) {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async toggleUserStatus(id: string, isActive: boolean) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ is_active: isActive })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async renewLicense(userId: string) {
    const { data, error } = await supabase
      .from('licenses')
      .update({ 
        type: 'premium',
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
      })
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};