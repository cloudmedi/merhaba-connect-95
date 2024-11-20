import { supabase } from "@/integrations/supabase/client";
import { CreateUserData, User } from "@/types/auth";
import { toast } from "sonner";

export const createUser = async (userData: CreateUserData) => {
  try {
    // Create company first
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .insert({
        name: userData.companyName,
        subscription_status: userData.license.type,
        subscription_ends_at: userData.license.endDate
      })
      .select()
      .single();

    if (companyError) throw companyError;

    // Create profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        email: userData.email,
        first_name: userData.firstName,
        last_name: userData.lastName,
        role: userData.role,
        company_id: company.id,
        is_active: true
      })
      .select()
      .single();

    if (profileError) throw profileError;

    // Create license
    const { error: licenseError } = await supabase
      .from('licenses')
      .insert({
        user_id: profile.id,
        type: userData.license.type,
        start_date: userData.license.startDate,
        end_date: userData.license.endDate,
        quantity: userData.license.quantity
      });

    if (licenseError) throw licenseError;

    return profile;
  } catch (error: any) {
    toast.error("Failed to create user: " + error.message);
    throw error;
  }
};

export const updateUser = async (id: string, updates: Partial<User>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteUser = async (userId: string) => {
  try {
    // Delete profile (this will cascade delete licenses due to FK constraint)
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (profileError) throw profileError;

    return { success: true };
  } catch (error: any) {
    toast.error("Failed to delete user: " + error.message);
    throw error;
  }
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
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
    })
    .eq('user_id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};