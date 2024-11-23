import { supabase } from '@/integrations/supabase/client';
import type { License } from '@/types/api';

export const licenseService = {
  async getLicenses(companyId: string) {
    const { data, error } = await supabase
      .from('licenses')
      .select('*')
      .eq('company_id', companyId);

    if (error) {
      throw new Error(error.message);
    }

    return data as License[];
  },

  async createLicense(license: Omit<License, 'id'>) {
    const { data, error } = await supabase
      .from('licenses')
      .insert(license)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as License;
  },

  async updateLicense(id: string, updates: Partial<License>) {
    const { data, error } = await supabase
      .from('licenses')
      .update(updates)
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as License;
  },

  async deleteLicense(id: string) {
    const { error } = await supabase
      .from('licenses')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
  }
};
