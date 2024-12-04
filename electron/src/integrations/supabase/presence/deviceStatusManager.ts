import { SupabaseClient } from '@supabase/supabase-js';
import { DeviceStatus } from './types';

export class DeviceStatusManager {
  constructor(private supabase: SupabaseClient) {}

  async verifyDevice(deviceToken: string): Promise<boolean> {
    const { data: device, error } = await this.supabase
      .from('devices')
      .select('*')
      .eq('token', deviceToken)
      .single();

    if (error || !device) {
      console.error('Device not found:', error);
      return false;
    }

    console.log('Found device:', device);
    return true;
  }

  async updateStatus(deviceToken: string, status: 'online' | 'offline', systemInfo?: any): Promise<void> {
    try {
      const currentSystemInfo = systemInfo || (status === 'online' ? await (window as any).electronAPI.getSystemInfo() : null);
      console.log(`Updating device status to ${status}`, { systemInfo: currentSystemInfo });
      
      const { data, error } = await this.supabase
        .from('devices')
        .update({
          status,
          system_info: currentSystemInfo || {},
          last_seen: new Date().toISOString(),
        })
        .eq('token', deviceToken)
        .select();

      if (error) {
        throw error;
      }

      console.log('Device status updated successfully:', data);
    } catch (error) {
      console.error('Error updating device status:', error);
    }
  }

  setupStatusChannel(deviceToken: string) {
    return this.supabase.channel(`device_${deviceToken}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'devices',
          filter: `token=eq.${deviceToken}`
        },
        (payload) => {
          console.log('Device status change received:', payload);
        }
      )
      .subscribe();
  }
}