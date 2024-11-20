import { supabase } from '@/integrations/supabase/client';
import { CreateUserData } from '@/types/auth';

export const createUser = async (userData: CreateUserData) => {
  // 1. Create company
  const { data: company, error: companyError } = await supabase
    .from('companies')
    .insert({
      name: userData.companyName,
      subscription_status: userData.license.type,
      subscription_ends_at: new Date(userData.license.endDate).toISOString()
    })
    .select()
    .single();

  if (companyError) {
    console.error('Company creation error:', companyError);
    throw new Error('Failed to create company');
  }

  // 2. Create Supabase auth user
  const { data: authUser, error: authError } = await supabase.auth.signUp({
    email: userData.email,
    password: 'temp123!',
    options: {
      data: {
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role
      }
    }
  });

  if (authError) {
    console.error('Auth user creation error:', authError);
    throw new Error('Failed to create auth user');
  }

  if (!authUser.user) {
    throw new Error('No user returned from auth signup');
  }

  // 3. Update profile record with company_id
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .update({
      company_id: company.id,
      first_name: userData.firstName,
      last_name: userData.lastName,
      email: userData.email,
      role: userData.role,
      is_active: true
    })
    .eq('id', authUser.user.id)
    .select()
    .single();

  if (profileError) {
    console.error('Profile update error:', profileError);
    throw new Error('Failed to update profile');
  }

  // 4. Create license
  const { data: license, error: licenseError } = await supabase
    .from('licenses')
    .insert({
      user_id: authUser.user.id,  // Use the auth user ID directly
      type: userData.license.type,
      start_date: new Date(userData.license.startDate).toISOString(),
      end_date: new Date(userData.license.endDate).toISOString(),
      quantity: userData.license.quantity
    })
    .select()
    .single();

  if (licenseError) {
    console.error('License creation error:', licenseError);
    throw new Error('Failed to create license');
  }

  return { ...profile, license };
};

export const updateUser = async (id: string, updates: Partial<CreateUserData>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteUser = async (id: string) => {
  const { error } = await supabase.auth.admin.deleteUser(id);
  if (error) throw error;
};

export const toggleUserStatus = async (id: string, isActive: boolean) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ is_active: isActive })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const renewLicense = async (userId: string) => {
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
};
