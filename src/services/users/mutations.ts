import { supabase } from '../supabase';
import { CreateUserData, User } from '@/types/auth';
import { companyService } from '../company';
import { licenseService } from '../license';

export const createUser = async (userData: CreateUserData) => {
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

  // 3. Create user record
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

  // 4. Create license
  await licenseService.createLicense({
    userId: user.id,
    type: userData.license.type,
    startDate: userData.license.startDate,
    endDate: userData.license.endDate,
    quantity: userData.license.quantity
  });

  return user;
};

export const updateUser = async (id: string, updates: Partial<User>) => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteUser = async (id: string) => {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

export const toggleUserStatus = async (id: string, isActive: boolean) => {
  const { data, error } = await supabase
    .from('users')
    .update({ is_active: isActive })
    .eq('id', id)
    .select('*')
    .single();
  
  if (error) throw error;
  return data;
};

export const renewLicense = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .update({ 
      license: 'premium',
      expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    })
    .eq('id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};