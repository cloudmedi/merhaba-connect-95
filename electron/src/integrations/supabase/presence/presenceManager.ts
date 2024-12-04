import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';

interface PresenceState {
  token: string;
  status: 'online' | 'offline';
  systemInfo: any;
  lastSeen: string;
}

export class PresenceManager {
  private presenceChannel: ReturnType<typeof createClient>['channel'] | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private deviceToken: string | null = null;
  private supabase: ReturnType<typeof createClient>;

  constructor(supabase: ReturnType<typeof createClient>) {
    this.supabase = supabase;
  }

  async initialize(deviceToken: string) {
    try {
      console.log('Initializing presence manager with token:', deviceToken);
      this.deviceToken = deviceToken;
      await this.setupPresenceChannel();
    } catch (error) {
      console.error('Failed to initialize presence:', error);
      throw error;
    }
  }

  private async setupPresenceChannel() {
    if (!this.deviceToken) {
      console.log('No device token available, skipping presence setup');
      return;
    }

    try {
      if (this.presenceChannel) {
        console.log('Cleaning up existing presence channel');
        await this.cleanup();
      }

      console.log('Setting up new presence channel');
      this.presenceChannel = this.supabase.channel(`presence_${this.deviceToken}`, {
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
          toast.success('Device is online');
        })
        .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
          console.log('Device left:', key, leftPresences);
          toast.error('Device went offline');
        });

      await this.presenceChannel.subscribe(async (status) => {
        console.log('Presence channel subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to presence channel');
          await this.startHeartbeat();
        }
      });
    } catch (error) {
      console.error('Error setting up presence channel:', error);
      throw error;
    }
  }

  private async startHeartbeat() {
    if (!this.deviceToken) {
      console.log('No device token available, skipping heartbeat');
      return;
    }

    try {
      console.log('Starting heartbeat');
      await this.updatePresence();

      if (this.heartbeatInterval) {
        console.log('Clearing existing heartbeat interval');
        clearInterval(this.heartbeatInterval);
      }

      this.heartbeatInterval = setInterval(async () => {
        await this.updatePresence();
      }, 5000);
    } catch (error) {
      console.error('Error starting heartbeat:', error);
      await this.setupPresenceChannel();
    }
  }

  private async updatePresence() {
    if (!this.deviceToken || !this.presenceChannel) {
      console.log('Missing required data for presence update');
      return;
    }

    try {
      const systemInfo = await (window as any).electronAPI.getSystemInfo();
      console.log('Updating presence with system info:', systemInfo);
      
      await this.presenceChannel.track({
        token: this.deviceToken,
        status: 'online',
        systemInfo,
        lastSeen: new Date().toISOString(),
      } as PresenceState);

    } catch (error) {
      console.error('Error updating presence:', error);
      throw error;
    }
  }

  async cleanup() {
    console.log('Starting presence cleanup...');

    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    if (this.presenceChannel && this.deviceToken) {
      try {
        await this.presenceChannel.track({
          token: this.deviceToken,
          status: 'offline',
          lastSeen: new Date().toISOString(),
        } as PresenceState);

        await this.supabase.removeChannel(this.presenceChannel);
      } catch (error) {
        console.error('Error during presence cleanup:', error);
      }
    }

    this.presenceChannel = null;
    this.deviceToken = null;
    console.log('Presence cleanup completed');
  }
}