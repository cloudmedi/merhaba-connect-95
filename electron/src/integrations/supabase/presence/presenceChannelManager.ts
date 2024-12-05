import { SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import { PresenceConfig } from './types';

export class PresenceChannelManager {
  private presenceChannel: RealtimeChannel | null = null;
  private isSubscribed = false;

  constructor(
    private supabase: SupabaseClient,
    private deviceToken: string,
    private config: Required<PresenceConfig>,
    private onStatusChange: (status: 'online' | 'offline') => Promise<void>
  ) {}

  async setup(): Promise<void> {
    try {
      if (this.presenceChannel) {
        await this.cleanup();
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
          if (this.isSubscribed) {
            const state = this.presenceChannel?.presenceState();
            console.log('Presence state synced:', state);
          }
        })
        .on('presence', { event: 'join' }, ({ key, newPresences }) => {
          if (this.isSubscribed) {
            console.log('Device joined:', key, newPresences);
            this.onStatusChange('online');
          }
        })
        .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
          if (this.isSubscribed) {
            console.log('Device left:', key, leftPresences);
            this.onStatusChange('offline');
          }
        });

      await this.presenceChannel.subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          this.isSubscribed = true;
          console.log('Successfully subscribed to presence channel');
          await this.track('online');
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          this.isSubscribed = false;
          console.log('Presence channel closed or error occurred');
          await this.onStatusChange('offline');
          setTimeout(() => this.setup(), this.config.reconnectDelay);
        }
      });

    } catch (error) {
      console.error('Error setting up presence channel:', error);
      this.isSubscribed = false;
      setTimeout(() => this.setup(), this.config.reconnectDelay);
    }
  }

  async track(status: 'online' | 'offline'): Promise<void> {
    if (!this.deviceToken || !this.presenceChannel || !this.isSubscribed) return;

    try {
      await this.presenceChannel.track({
        token: this.deviceToken,
        status,
        lastSeen: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error updating presence:', error);
      this.isSubscribed = false;
      await this.setup();
    }
  }

  async cleanup(): Promise<void> {
    if (this.presenceChannel) {
      try {
        this.isSubscribed = false;
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