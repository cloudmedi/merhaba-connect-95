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
    try {
      // 1. Create company first
      const company = await companyService.createCompany({
        name: userData.companyName,
        subscriptionStatus: userData.license.type,
        subscriptionEndsAt: userData.license.end_date,
      });

      // 2. Create Supabase auth user with password
      const { data: authUser, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: 'Welcome123!', // Default password that user will need to change
        options: {
          data: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            role: userData.role,
            companyId: company.id
          }
        }
      });

      if (authError) throw authError;
      if (!authUser.user) throw new Error('Failed to create user');

      // Wait for the trigger to create the profile
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 3. Update the profile with company_id
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          company_id: company.id,
          role: userData.role,
          is_active: true
        })
        .eq('id', authUser.user.id);

      if (profileError) throw profileError;

      // 4. Create license
      await licenseService.createLicense({
        userId: authUser.user.id,
        type: userData.license.type,
        start_date: userData.license.start_date,
        end_date: userData.license.end_date,
        quantity: userData.license.quantity
      });

      // 5. Fetch and return the created user with all relations
      const { data: profile, error: fetchError } = await supabase
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
        .eq('id', authUser.user.id)
        .single();

      if (fetchError) throw fetchError;
      return profile;

    } catch (error: any) {
      console.error('Error in createUser:', error);
      throw error;
    }
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
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};