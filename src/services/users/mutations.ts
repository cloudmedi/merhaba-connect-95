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

  if (companyError) throw companyError;

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

  if (authError) throw authError;

  // 3. Update profile record with company_id
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .update({
      company_id: company.id,
      role: userData.role,
      is_active: true
    })
    .eq('id', authUser.user!.id)
    .select()
    .single();

  if (profileError) throw profileError;

  // 4. Create license
  const { error: licenseError } = await supabase
    .from('licenses')
    .insert({
      user_id: profile.id,
      type: userData.license.type,
      start_date: new Date(userData.license.startDate).toISOString(),
      end_date: new Date(userData.license.endDate).toISOString(),
      quantity: userData.license.quantity
    });

  if (licenseError) throw licenseError;

  return profile;
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