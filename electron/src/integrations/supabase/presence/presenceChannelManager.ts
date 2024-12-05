import { SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import { PresenceConfig } from './types';

export class PresenceChannelManager {
  private presenceChannel: RealtimeChannel | null = null;
  private isSubscribed = false;
  private lastTrackTime: number = 0;
  private readonly MIN_TRACK_INTERVAL = 1000; // 1 saniye minimum izleme aralığı
  private currentState: 'online' | 'offline' = 'offline';
  private stateUpdateTimeout: NodeJS.Timeout | null = null;
  private lastHeartbeatTime: number = Date.now();
  private readonly OFFLINE_THRESHOLD = 10000; // 10 saniye eşiği

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
            this.handleStateSync(state);
          }
        })
        .on('presence', { event: 'join' }, ({ key, newPresences }) => {
          if (this.isSubscribed) {
            console.log('Device joined:', {
              key,
              newPresences,
              timestamp: new Date().toISOString()
            });
            this.handleStateChange('online');
            this.lastHeartbeatTime = Date.now(); // Join olayında heartbeat zamanını güncelle
          }
        })
        .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
          if (this.isSubscribed) {
            console.log('Device left:', {
              key,
              leftPresences,
              timestamp: new Date().toISOString()
            });
            
            // Leave olayını sadece son heartbeat'ten belirli bir süre geçtiyse işle
            const timeSinceLastHeartbeat = Date.now() - this.lastHeartbeatTime;
            if (timeSinceLastHeartbeat > this.OFFLINE_THRESHOLD) {
              console.log('Device is truly offline - no heartbeat for:', timeSinceLastHeartbeat, 'ms');
              this.handleStateChange('offline');
            } else {
              console.log('Ignoring leave event - recent heartbeat detected:', timeSinceLastHeartbeat, 'ms ago');
            }
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
          const timeSinceLastHeartbeat = Date.now() - this.lastHeartbeatTime;
          if (timeSinceLastHeartbeat > this.OFFLINE_THRESHOLD) {
            this.handleStateChange('offline');
          }
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
      setTimeout(() => this.setup(), this.config.reconnectDelay);
    }
  }

  private handleStateSync(state: any): void {
    const presences = state[this.deviceToken] || [];
    const isOnline = presences.length > 0;
    
    if (isOnline) {
      this.lastHeartbeatTime = Date.now(); // State sync'te online ise heartbeat zamanını güncelle
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
      console.log('Cannot track presence:', {
        hasToken: !!this.deviceToken,
        hasChannel: !!this.presenceChannel,
        isSubscribed: this.isSubscribed
      });
      return;
    }

    const now = Date.now();
    if (now - this.lastTrackTime < this.MIN_TRACK_INTERVAL) {
      console.log('Skipping track, too soon since last update');
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
      
      this.lastTrackTime = now;
      if (status === 'online') {
        this.lastHeartbeatTime = now;
      }
      console.log('Successfully tracked presence status');
    } catch (error) {
      console.error('Error updating presence:', {
        error,
        status,
        deviceToken: this.deviceToken,
        timestamp: new Date().toISOString()
      });
      await this.setup();
    }
  }

  async cleanup(): Promise<void> {
    if (this.stateUpdateTimeout) {
      clearTimeout(this.stateUpdateTimeout);
    }

    if (this.presenceChannel) {
      try {
        console.log('Starting presence channel cleanup');
        this.isSubscribed = false;
        
        console.log('Tracking offline status before cleanup');
        await this.track('offline');
        
        console.log('Removing presence channel');
        await this.supabase.removeChannel(this.presenceChannel);
        this.presenceChannel = null;
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