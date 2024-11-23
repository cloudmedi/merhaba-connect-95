import { supabase } from '@/integrations/supabase/client';
import type { Company } from '@/types/api';

const mapDbCompanyToCompany = (dbCompany: any): Company => ({
  id: dbCompany.id,
  name: dbCompany.name,
  subscriptionStatus: dbCompany.subscription_status,
  subscriptionEndsAt: dbCompany.subscription_ends_at,
  trialEndsAt: dbCompany.trial_ends_at,
  trialStatus: dbCompany.trial_status,
  trialNotificationSent: dbCompany.trial_notification_sent,
  maxBranches: 10, // Default values - adjust as needed
  maxDevices: 50, // Default values - adjust as needed
  createdAt: dbCompany.created_at,
  updatedAt: dbCompany.updated_at
});

export const companyService = {
  async getAllCompanies(): Promise<Company[]> {
    const { data, error } = await supabase
      .from('companies')
      .select('*');

    if (error) throw error;
    return data.map(mapDbCompanyToCompany);
  },

  async getCompanyById(id: string): Promise<Company | null> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data ? mapDbCompanyToCompany(data) : null;
  },

  async createCompany(company: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>): Promise<Company> {
    const { data, error } = await supabase
      .from('companies')
      .insert({
        name: company.name,
        subscription_status: company.subscriptionStatus,
        subscription_ends_at: company.subscriptionEndsAt,
        trial_ends_at: company.trialEndsAt,
        trial_status: company.trialStatus,
        trial_notification_sent: company.trialNotificationSent
      })
      .select()
      .single();

    if (error) throw error;
    return mapDbCompanyToCompany(data);
  },

  async updateCompany(id: string, updates: Partial<Omit<Company, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Company> {
    const { data, error } = await supabase
      .from('companies')
      .update({
        name: updates.name,
        subscription_status: updates.subscriptionStatus,
        subscription_ends_at: updates.subscriptionEndsAt,
        trial_ends_at: updates.trialEndsAt,
        trial_status: updates.trialStatus,
        trial_notification_sent: updates.trialNotificationSent
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapDbCompanyToCompany(data);
  },

  async deleteCompany(id: string): Promise<void> {
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};