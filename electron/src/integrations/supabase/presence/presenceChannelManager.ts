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
  ) {
    console.log('PresenceChannelManager initialized for device:', deviceToken);
  }

  async setup(): Promise<void> {
    try {
      if (this.presenceChannel) {
        console.log('Cleaning up existing presence channel before setup');
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

      console.log('Channel created, setting up event handlers');

      this.presenceChannel
        .on('presence', { event: 'sync' }, () => {
          if (this.isSubscribed) {
            const state = this.presenceChannel?.presenceState();
            console.log('Presence state synced:', {
              state,
              timestamp: new Date().toISOString()
            });
          }
        })
        .on('presence', { event: 'join' }, ({ key, newPresences }) => {
          if (this.isSubscribed) {
            console.log('Device joined:', {
              key,
              newPresences,
              timestamp: new Date().toISOString()
            });
            this.onStatusChange('online');
          }
        })
        .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
          if (this.isSubscribed) {
            console.log('Device left:', {
              key,
              leftPresences,
              timestamp: new Date().toISOString()
            });
            this.onStatusChange('offline');
          }
        });

      console.log('Subscribing to presence channel...');
      await this.presenceChannel.subscribe(async (status) => {
        console.log('Subscription status changed:', status);
        
        if (status === 'SUBSCRIBED') {
          this.isSubscribed = true;
          console.log('Successfully subscribed to presence channel');
          await this.track('online');
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          console.log('Channel closed or error occurred:', status);
          this.isSubscribed = false;
          await this.onStatusChange('offline');
          console.log(`Attempting to reconnect in ${this.config.reconnectDelay}ms`);
          setTimeout(() => this.setup(), this.config.reconnectDelay);
        }
      });

    } catch (error) {
      console.error('Error setting up presence channel:', {
        error,
        deviceToken: this.deviceToken,
        timestamp: new Date().toISOString()
      });
      this.isSubscribed = false;
      setTimeout(() => this.setup(), this.config.reconnectDelay);
    }
  }

  async track(status: 'online' | 'offline'): Promise<void> {
    if (!this.deviceToken || !this.presenceChannel || !this.isSubscribed) {
      console.log('Cannot track presence:', {
        hasToken: !!this.deviceToken,
        hasChannel: !!this.presenceChannel,
        isSubscribed: this.isSubscribed
      });
      return;
    }

    try {
      console.log('Tracking presence status:', {
        status,
        deviceToken: this.deviceToken,
        timestamp: new Date().toISOString()
      });
      
      await this.presenceChannel.track({
        token: this.deviceToken,
        status,
        lastSeen: new Date().toISOString(),
      });
      
      console.log('Successfully tracked presence status');
    } catch (error) {
      console.error('Error updating presence:', {
        error,
        status,
        deviceToken: this.deviceToken,
        timestamp: new Date().toISOString()
      });
      this.isSubscribed = false;
      await this.setup();
    }
  }

  async cleanup(): Promise<void> {
    if (this.presenceChannel) {
      try {
        console.log('Starting presence channel cleanup');
        this.isSubscribed = false;
        
        console.log('Tracking offline status before cleanup');
        await this.presenceChannel.track({
          token: this.deviceToken,
          status: 'offline',
          lastSeen: new Date().toISOString(),
        });
        
        console.log('Removing presence channel');
        await this.supabase.removeChannel(this.presenceChannel);
        console.log('Presence channel cleanup completed');
      } catch (error) {
        console.error('Error during presence cleanup:', {
          error,
          deviceToken: this.deviceToken,
          timestamp: new Date().toISOString()
        });
      }
    }
  }
}