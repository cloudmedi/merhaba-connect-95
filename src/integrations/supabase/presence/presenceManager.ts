import { SupabaseClient } from '@supabase/supabase-js';

interface PresenceConfig {
  heartbeatInterval?: number;
  reconnectDelay?: number;
}

export class PresenceManager {
  private deviceToken: string | null = null;
  private presenceChannel: any;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private config: Required<PresenceConfig>;

  constructor(
    private supabase: SupabaseClient,
    config: PresenceConfig = {}
  ) {
    this.config = {
      heartbeatInterval: config.heartbeatInterval || 5000,
      reconnectDelay: config.reconnectDelay || 3000
    };
  }

  async initialize(deviceToken: string): Promise<void> {
    this.deviceToken = deviceToken;
    this.presenceChannel = this.supabase.channel('device_status');
    
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
    }, this.config.heartbeatInterval);
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