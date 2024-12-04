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
      // Verify device exists before setting up presence
      const { data: device } = await this.supabase
        .from('devices')
        .select('*')
        .eq('token', deviceToken)
        .single();

      if (!device) {
        console.log('Device not registered yet, skipping presence setup');
        return;
      }

      await this.setupPresenceChannel();
      this.setupCleanup();
    } catch (error) {
      console.error('Error initializing presence:', error);
      throw error;
    }
  }

  private async setupPresenceChannel(): Promise<void> {
    if (!this.deviceToken) return;

    try {
      // Remove existing channel if any
      if (this.presenceChannel) {
        await this.supabase.removeChannel(this.presenceChannel);
      }

      const channelName = `device_${this.deviceToken}`;
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
        })
        .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
          console.log('Device left:', key, leftPresences);
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

      await updateDeviceStatus(this.deviceToken, 'online', systemInfo);
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
        // Update device status to offline
        await updateDeviceStatus(this.deviceToken, 'offline', null);
        
        // Track offline status in presence channel
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