import { supabase } from "@/integrations/supabase/client";
import { CreateUserFormValues } from "@/pages/SuperAdmin/Users/components/CreateUserForm/types";
import { User } from "@/types/auth";
import { toast } from "sonner";

export const createUser = async (userData: CreateUserFormValues) => {
  try {
    // First create the company
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

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: 'temp123!', // Temporary password
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

    // The profile will be created automatically by the database trigger
    // We just need to wait a moment and then fetch it
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Fetch the created profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select(`
        *,
        companies (
          id,
          name,
          subscription_status,
          subscription_ends_at
        )
      `)
      .eq('id', authData.user!.id)
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
    console.error('Error creating user:', error);
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
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId);
  
  if (error) throw error;
  return { success: true };
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