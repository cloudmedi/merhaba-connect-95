import { SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import { PresenceConfig } from './types';

export class PresenceChannelManager {
  private channel: RealtimeChannel | null = null;

  constructor(
    private supabase: SupabaseClient,
    private deviceToken: string,
    private config: Required<PresenceConfig>,
    private onStatusChange: (status: 'online' | 'offline') => Promise<void>
  ) {}

  async setup(): Promise<void> {
    if (this.channel) {
      await this.cleanup();
    }

    this.channel = this.supabase.channel(`device_${this.deviceToken}`)
      .on('presence', { event: 'sync' }, () => {
        console.log('Presence state synchronized');
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('Join event:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('Leave event:', key, leftPresences);
      });

    await this.channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await this.channel?.track({
          token: this.deviceToken,
          online_at: new Date().toISOString()
        });
      }
    });
  }

  async cleanup(): Promise<void> {
    if (this.channel) {
      await this.channel.unsubscribe();
      this.channel = null;
    }
  }

  getChannel(): RealtimeChannel | null {
    return this.channel;
  }
}