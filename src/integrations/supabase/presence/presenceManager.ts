import { SupabaseClient } from '@supabase/supabase-js';

interface PresenceManagerOptions {
  heartbeatInterval: number;
  reconnectDelay: number;
}

export class PresenceManager {
  private client: SupabaseClient;
  private options: PresenceManagerOptions;
  private presenceChannel: any;
  private deviceToken: string | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;

  constructor(client: SupabaseClient, options: PresenceManagerOptions) {
    this.client = client;
    this.options = options;
  }

  async initialize(deviceToken: string) {
    this.deviceToken = deviceToken;
    this.presenceChannel = this.client.channel('device_status');
    
    await this.setupPresence();
    this.startHeartbeat();
  }

  private async setupPresence() {
    if (!this.presenceChannel || !this.deviceToken) return;

    try {
      await this.presenceChannel
        .on('presence', { event: 'sync' }, () => {
          console.log('Presence state synchronized');
        })
        .on('presence', { event: 'join' }, ({ key, newPresences }: any) => {
          console.log('Presence join:', key, newPresences);
        })
        .on('presence', { event: 'leave' }, ({ key, leftPresences }: any) => {
          console.log('Presence leave:', key, leftPresences);
        })
        .subscribe(async (status: string) => {
          if (status === 'SUBSCRIBED') {
            await this.presenceChannel.track({
              token: this.deviceToken,
              online_at: new Date().toISOString()
            });
          }
        });
    } catch (error) {
      console.error('Error setting up presence:', error);
    }
  }

  private startHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    this.heartbeatInterval = setInterval(async () => {
      try {
        if (this.presenceChannel) {
          await this.presenceChannel.track({
            token: this.deviceToken,
            online_at: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error('Heartbeat error:', error);
      }
    }, this.options.heartbeatInterval);
  }

  cleanup() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    if (this.presenceChannel) {
      this.presenceChannel.unsubscribe();
      this.presenceChannel = null;
    }

    this.deviceToken = null;
  }
}