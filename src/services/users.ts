import { supabase } from './supabase';
import { User } from '@/types/auth';

export const userService = {
  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data: authUser, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: 'temp123!', // Geçici şifre, kullanıcıya email ile gönderilecek
      options: {
        data: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: 'manager',
          companyId: userData.companyId,
        }
      }
    });

    if (authError) throw authError;

    const { data, error } = await supabase
      .from('users')
      .insert({
        id: authUser.user!.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: 'manager',
        companyId: userData.companyId,
        isActive: true
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) throw error;
    return data;
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
    // Önce auth user'ı sil
    const { error: authError } = await supabase.auth.admin.deleteUser(id);
    if (authError) throw authError;

    // Sonra users tablosundan sil
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};