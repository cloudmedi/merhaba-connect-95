import { SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import { PresenceConfig } from './types';

export class PresenceChannelManager {
  private presenceChannel: RealtimeChannel | null = null;
  private isSubscribed = false;
  private lastTrackTime: number = 0;
  private readonly MIN_TRACK_INTERVAL = 1000;
  private currentState: 'online' | 'offline' = 'offline';
  private stateUpdateTimeout: NodeJS.Timeout | null = null;
  private lastHeartbeatTime: number = Date.now();
  private readonly OFFLINE_THRESHOLD = 10000;

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

      this.presenceChannel = this.supabase.channel(channelName);

      if (!this.presenceChannel) {
        throw new Error('Failed to create presence channel');
      }

      this.setupEventHandlers();
      await this.subscribeToChannel();

    } catch (error) {
      console.error('Error setting up presence channel:', error);
      setTimeout(() => this.setup(), this.config.reconnectDelay);
    }
  }

  private setupEventHandlers(): void {
    if (!this.presenceChannel) return;

    this.presenceChannel
      .on('presence', { event: 'sync' }, () => {
        if (this.isSubscribed) {
          const state = this.presenceChannel?.presenceState();
          this.handleStateSync(state);
        }
      })
      .on('presence', { event: 'join' }, () => {
        if (this.isSubscribed) {
          this.handleStateChange('online');
          this.lastHeartbeatTime = Date.now();
        }
      })
      .on('presence', { event: 'leave' }, () => {
        if (this.isSubscribed) {
          const timeSinceLastHeartbeat = Date.now() - this.lastHeartbeatTime;
          if (timeSinceLastHeartbeat > this.OFFLINE_THRESHOLD) {
            this.handleStateChange('offline');
          }
        }
      });
  }

  private async subscribeToChannel(): Promise<void> {
    if (!this.presenceChannel) return;

    await this.presenceChannel.subscribe(async (status) => {
      console.log('Subscription status changed:', status);
      
      if (status === 'SUBSCRIBED') {
        this.isSubscribed = true;
        await this.track('online');
      } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
        const timeSinceLastHeartbeat = Date.now() - this.lastHeartbeatTime;
        if (timeSinceLastHeartbeat > this.OFFLINE_THRESHOLD) {
          this.handleStateChange('offline');
        }
        setTimeout(() => this.setup(), this.config.reconnectDelay);
      }
    });
  }

  private handleStateSync(state: any): void {
    const presences = state[this.deviceToken] || [];
    const isOnline = presences.length > 0;
    
    if (isOnline) {
      this.lastHeartbeatTime = Date.now();
    }
    
    const timeSinceLastHeartbeat = Date.now() - this.lastHeartbeatTime;
    if (!isOnline && timeSinceLastHeartbeat > this.OFFLINE_THRESHOLD) {
      this.handleStateChange('offline');
    } else if (isOnline) {
      this.handleStateChange('online');
    }
  }

  private handleStateChange(newState: 'online' | 'offline'): void {
    if (this.currentState !== newState) {
      this.currentState = newState;
      this.onStatusChange(newState);
    }
  }

  async track(status: 'online' | 'offline'): Promise<void> {
    if (!this.deviceToken || !this.presenceChannel || !this.isSubscribed) {
      return;
    }

    const now = Date.now();
    if (now - this.lastTrackTime < this.MIN_TRACK_INTERVAL) {
      return;
    }

    try {
      await this.presenceChannel.track({
        token: this.deviceToken,
        status,
        lastSeen: new Date().toISOString(),
      });
      
      this.lastTrackTime = now;
      if (status === 'online') {
        this.lastHeartbeatTime = now;
      }
    } catch (error) {
      console.error('Error updating presence:', error);
      await this.setup();
    }
  }

  async cleanup(): Promise<void> {
    if (this.stateUpdateTimeout) {
      clearTimeout(this.stateUpdateTimeout);
    }

    if (this.presenceChannel) {
      try {
        this.isSubscribed = false;
        await this.track('offline');
        await this.supabase.removeChannel(this.presenceChannel);
        this.presenceChannel = null;
      } catch (error) {
        console.error('Error during presence cleanup:', error);
      }
    }
  }
}