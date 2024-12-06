import { SupabaseClient } from '@supabase/supabase-js';

export class DeviceStatusManager {
  constructor(private supabase: SupabaseClient) {}

  async updateStatus(deviceToken: string, status: 'online' | 'offline'): Promise<void> {
    try {
      // Sadece device status'ünü güncelle, token status'üne dokunma
      const { error } = await this.supabase
        .from('devices')
        .update({ 
          status,
          last_seen: new Date().toISOString()
        })
        .eq('token', deviceToken);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating device status:', error);
      throw error;
    }
  }

  async verifyDevice(deviceToken: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('device_tokens')
        .select('status')
        .eq('token', deviceToken)
        .single();

      if (error) throw error;
      return data?.status === 'active' || data?.status === 'used';
    } catch (error) {
      console.error('Error verifying device:', error);
      return false;
    }
  }
}