import { SupabaseClient } from '@supabase/supabase-js';

export class DeviceStatusManager {
  private lastUpdateTime: number = 0;
  private readonly MIN_UPDATE_INTERVAL = 2000; // 2 seconds

  constructor(private supabase: SupabaseClient) {}

  async verifyDevice(deviceToken: string): Promise<boolean> {
    const { data: device, error } = await this.supabase
      .from('devices')
      .select('id')
      .eq('token', deviceToken)
      .single();

    if (error || !device) {
      console.error('Device not found:', error);
      return false;
    }

    return true;
  }

  async updateStatus(deviceToken: string, status: 'online' | 'offline'): Promise<void> {
    const now = Date.now();
    if (now - this.lastUpdateTime < this.MIN_UPDATE_INTERVAL) {
      console.log('Skipping status update - too soon since last update');
      return;
    }

    try {
      console.log(`Updating device status to ${status}`);
      
      const { error } = await this.supabase
        .from('devices')
        .update({
          status,
          last_seen: new Date().toISOString(),
        })
        .eq('token', deviceToken);

      if (error) {
        throw error;
      }

      this.lastUpdateTime = now;
    } catch (error) {
      console.error('Error updating device status:', error);
      throw error;
    }
  }
}