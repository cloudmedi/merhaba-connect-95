import { supabase } from './supabase';

interface CreateCompanyData {
  name: string;
  subscriptionStatus: 'trial' | 'premium';
  subscriptionEndsAt: string;
}

export const companyService = {
  async createCompany(data: CreateCompanyData) {
    const { data: company, error } = await supabase
      .from('companies')
      .insert({
        name: data.name,
        subscription_status: data.subscriptionStatus === 'premium' ? 'active' : 'trial',
        subscription_ends_at: data.subscriptionEndsAt
      })
      .select()
      .single();

    if (error) throw error;
    return company;
  }
};