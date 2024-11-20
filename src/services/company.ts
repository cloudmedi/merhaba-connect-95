import { supabase } from './supabase';
import { Company } from '@/types/auth';

export const companyService = {
  async createCompany(data: Partial<Company>) {
    const { data: company, error } = await supabase
      .from('companies')
      .insert({
        name: data.name,
        subscriptionStatus: data.subscriptionStatus || 'trial',
        subscriptionEndsAt: data.subscriptionEndsAt,
        maxBranches: data.maxBranches || 1,
        maxDevices: data.maxDevices || 5
      })
      .select()
      .single();
    
    if (error) throw error;
    return company;
  },

  async getCompany(id: string) {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }
};