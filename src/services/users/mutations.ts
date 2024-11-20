import { supabase } from "@/integrations/supabase/client";
import { CreateUserFormValues } from "@/pages/SuperAdmin/Users/components/CreateUserForm/types";
import { User } from "@/types/auth";
import { toast } from "sonner";

export const createUser = async (userData: CreateUserFormValues) => {
  try {
    // First check if user already exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', userData.email)
      .single();

    if (existingUser) {
      throw new Error('A user with this email already exists');
    }

    // Create company first
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .insert({
        name: userData.companyName,
        subscription_status: userData.license.type,
        subscription_ends_at: userData.license.end_date
      })
      .select()
      .single();

    if (companyError) throw companyError;

    // Generate a UUID for the new profile
    const newProfileId = crypto.randomUUID();

    // Create profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: newProfileId,
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
        start_date: userData.license.start_date,
        end_date: userData.license.end_date,
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

export const deleteUser = async (userId: string): Promise<{ success: boolean }> => {
  try {
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (fetchError) {
      console.error('Fetch profile error:', fetchError);
      throw new Error('Kullanıcı bulunamadı');
    }

    if (!profile) {
      throw new Error('Kullanıcı bulunamadı');
    }

    const { error: deleteError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId)
      .throwOnError();

    if (deleteError) {
      console.error('Delete profile error:', deleteError);
      throw new Error('Kullanıcı silinirken bir hata oluştu');
    }

    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete user:', error);
    throw new Error(error.message || 'Kullanıcı silinirken bir hata oluştu');
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
