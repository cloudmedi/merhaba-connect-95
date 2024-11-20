import { supabase } from '@/integrations/supabase/client';
import { CreateUserData } from '@/types/auth';

export const createUser = async (userData: CreateUserData) => {
  try {
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

    if (companyError) throw new Error('Failed to create company: ' + companyError.message);

    // 2. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: 'temp123!', // Temporary password
      options: {
        data: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role
        }
      }
    });

    if (authError || !authData.user) throw new Error('Failed to create auth user: ' + authError?.message);

    // 3. Update profile
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        company_id: company.id,
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        role: userData.role,
        is_active: true
      })
      .eq('id', authData.user.id);

    if (profileError) throw new Error('Failed to update profile: ' + profileError.message);

    // 4. Create license
    const { error: licenseError } = await supabase
      .from('licenses')
      .insert({
        user_id: authData.user.id,
        type: userData.license.type,
        start_date: new Date(userData.license.startDate).toISOString(),
        end_date: new Date(userData.license.endDate).toISOString(),
        quantity: userData.license.quantity
      });

    if (licenseError) throw new Error('Failed to create license: ' + licenseError.message);

    return {
      id: authData.user.id,
      ...userData
    };
  } catch (error) {
    console.error('User creation failed:', error);
    throw error;
  }
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
