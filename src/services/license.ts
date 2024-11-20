import { supabase } from './supabase';

interface LicenseData {
  userId: string;
  type: 'trial' | 'premium';
  startDate: string;
  endDate: string;
  quantity: number;
}

export const licenseService = {
  async createLicense(data: LicenseData) {
    const { data: license, error } = await supabase
      .from('licenses')
      .insert({
        user_id: data.userId,
        type: data.type,
        start_date: data.startDate,
        end_date: data.endDate,
        quantity: data.quantity
      })
      .select()
      .single();

    if (error) throw error;
    return license;
  },

  async getUserLicenses(userId: string) {
    const { data, error } = await supabase
      .from('licenses')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  }
};