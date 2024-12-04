import { SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import { PresenceConfig } from './types';

export class PresenceChannelManager {
  private presenceChannel: RealtimeChannel | null = null;

  constructor(
    private supabase: SupabaseClient,
    private deviceToken: string,
    private config: Required<PresenceConfig>,
    private onStatusChange: (status: 'online' | 'offline') => Promise<void>
  ) {}

  async setup(): Promise<void> {
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
          this.onStatusChange('online');
        })
        .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
          console.log('Device left:', key, leftPresences);
          this.onStatusChange('offline');
        });

      await this.presenceChannel.subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to presence channel');
        }
      });

    } catch (error) {
      console.error('Error setting up presence channel:', error);
      setTimeout(() => this.setup(), this.config.reconnectDelay);
    }
  }

  async track(status: 'online' | 'offline', systemInfo?: any): Promise<void> {
    if (!this.deviceToken || !this.presenceChannel) return;

    try {
      await this.presenceChannel.track({
        token: this.deviceToken,
        status,
        systemInfo,
        lastSeen: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error updating presence:', error);
      await this.setup();
    }
  }

  async cleanup(): Promise<void> {
    if (this.presenceChannel) {
      try {
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
  }
}