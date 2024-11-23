import { supabase } from '@/integrations/supabase/client';
import type { Company } from '@/types/api';

export const companyService = {
  async getAllCompanies(): Promise<Company[]> {
    const { data, error } = await supabase
      .from('companies')
      .select('*');

    if (error) throw error;

    return data as Company[];
  },

  async getCompanyById(id: string): Promise<Company | null> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return data as Company;
  },

  async createCompany(company: Omit<Company, 'id'>): Promise<Company> {
    const { data, error } = await supabase
      .from('companies')
      .insert(company)
      .select('*')
      .single();

    if (error) throw error;

    return data as Company;
  },

  async updateCompany(id: string, updates: Partial<Omit<Company, 'id'>>): Promise<Company> {
    const { data, error } = await supabase
      .from('companies')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;

    return data as Company;
  },

  async deleteCompany(id: string): Promise<void> {
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
