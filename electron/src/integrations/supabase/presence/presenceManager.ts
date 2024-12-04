import { SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import { PresenceState, PresenceConfig, SystemInfo } from './types';
import { updateDeviceStatus } from '../deviceStatus';

export class PresenceManager {
  private supabase: SupabaseClient;
  private presenceChannel: RealtimeChannel | null = null;
  private deviceToken: string | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private config: Required<PresenceConfig>;

  constructor(supabase: SupabaseClient, config: PresenceConfig = {}) {
    this.supabase = supabase;
    this.config = {
      heartbeatInterval: config.heartbeatInterval || 5000,
      reconnectDelay: config.reconnectDelay || 3000
    };
  }

  async initialize(deviceToken: string): Promise<void> {
    console.log('Initializing PresenceManager for device:', deviceToken);
    this.deviceToken = deviceToken;

    try {
      // First verify the device exists and get its current status
      const { data: device, error } = await this.supabase
        .from('devices')
        .select('*')
        .eq('token', deviceToken)
        .single();

      if (error || !device) {
        console.error('Device not found:', error);
        return;
      }

      console.log('Found device:', device);

      // Set up realtime subscription for device status changes
      const deviceChannel = this.supabase.channel(`device_${deviceToken}`)
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

      await this.setupPresenceChannel();
      this.setupCleanup();

      // Initial status update
      const systemInfo = await (window as any).electronAPI.getSystemInfo();
      await this.updateDeviceStatus('online', systemInfo);
    } catch (error) {
      console.error('Error initializing presence:', error);
      throw error;
    }
  }

  private async setupPresenceChannel(): Promise<void> {
    if (!this.deviceToken) return;

    try {
      if (this.presenceChannel) {
        await this.supabase.removeChannel(this.presenceChannel);
      }

      const channelName = `presence_${this.deviceToken}`;
      console.log('Setting up presence channel:', channelName);

      this.presenceChannel = this.supabase.channel(channelName, {
        config: {
          presence: {
            key: this.deviceToken,
          },
        }
      });

      this.presenceChannel
        .on('presence', { event: 'sync' }, () => {
          const state = this.presenceChannel?.presenceState();
          console.log('Presence state synced:', state);
        })
        .on('presence', { event: 'join' }, ({ key, newPresences }) => {
          console.log('Device joined:', key, newPresences);
          this.updateDeviceStatus('online');
        })
        .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
          console.log('Device left:', key, leftPresences);
          this.updateDeviceStatus('offline');
        });

      await this.presenceChannel.subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to presence channel');
          await this.startHeartbeat();
        }
      });

    } catch (error) {
      console.error('Error setting up presence channel:', error);
      setTimeout(() => this.setupPresenceChannel(), this.config.reconnectDelay);
    }
  }

  private async updateDeviceStatus(status: 'online' | 'offline', systemInfo?: any): Promise<void> {
    if (!this.deviceToken) return;
    
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
        .eq('token', this.deviceToken)
        .select();

      if (error) {
        throw error;
      }

      console.log('Device status updated successfully:', data);
    } catch (error) {
      console.error('Error updating device status:', error);
    }
  }

  private async startHeartbeat(): Promise<void> {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    await this.updatePresence();
    
    this.heartbeatInterval = setInterval(async () => {
      await this.updatePresence();
    }, this.config.heartbeatInterval);
  }

  private async updatePresence(): Promise<void> {
    if (!this.deviceToken || !this.presenceChannel) return;

    try {
      const systemInfo = await (window as any).electronAPI.getSystemInfo();
      
      await this.presenceChannel.track({
        token: this.deviceToken,
        status: 'online',
        systemInfo,
        lastSeen: new Date().toISOString(),
      });

      await this.updateDeviceStatus('online', systemInfo);
    } catch (error) {
      console.error('Error updating presence:', error);
      await this.setupPresenceChannel();
    }
  }

  private setupCleanup(): void {
    window.addEventListener('beforeunload', async (event) => {
      event.preventDefault();
      await this.cleanup();
    });
  }

  async cleanup(): Promise<void> {
    console.log('Starting presence cleanup...');
    
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      console.log('Cleared heartbeat interval');
    }
    
    if (this.presenceChannel && this.deviceToken) {
      try {
        await this.updateDeviceStatus('offline');
        
        await this.presenceChannel.track({
          token: this.deviceToken,
          status: 'offline',
          lastSeen: new Date().toISOString(),
        });
        
        await this.supabase.removeChannel(this.presenceChannel);
        console.log('Removed presence channel');
      } catch (error) {
        console.error('Error during presence cleanup:', error);
      }
    }

    this.deviceToken = null;
    this.presenceChannel = null;
    console.log('Presence cleanup completed');
  }
}