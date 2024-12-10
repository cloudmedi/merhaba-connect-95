import { SupabaseClient } from '@supabase/supabase-js';
import { PresenceConfig, DeviceStatus } from './types';
import { DeviceStatusManager } from './deviceStatusManager';
import { PresenceChannelManager } from './presenceChannelManager';
import { HeartbeatManager } from './heartbeatManager';
import { PresenceInitializer } from './presenceInitializer';

export class PresenceManager {
  private deviceToken: string | null = null;
  private deviceStatusManager: DeviceStatusManager;
  private presenceChannelManager: PresenceChannelManager | null = null;
  private heartbeatManager: HeartbeatManager | null = null;
  private config: Required<PresenceConfig>;
  private isInitialized = false;
  private lastStatus: DeviceStatus = 'offline';
  private missedHeartbeats = 0;
  private readonly MAX_MISSED_HEARTBEATS = 2;
  private presenceInitializer: PresenceInitializer;

  constructor(private supabase: SupabaseClient, config: PresenceConfig = {}) {
    console.log('Initializing PresenceManager with config:', config);
    
    this.config = {
      heartbeatInterval: config.heartbeatInterval || 5000,
      reconnectDelay: config.reconnectDelay || 3000
    };
    
    this.deviceStatusManager = new DeviceStatusManager(supabase);
    this.presenceInitializer = new PresenceInitializer(
      supabase,
      this.deviceStatusManager,
      this.config
    );
    console.log('PresenceManager constructed with config:', this.config);
  }

  async initialize(deviceToken: string): Promise<void> {
    if (this.isInitialized) {
      console.log('PresenceManager already initialized');
      return;
    }
    
    console.log('Initializing PresenceManager for device token:', deviceToken);
    this.deviceToken = deviceToken;

    try {
      this.missedHeartbeats = 0;

      this.presenceChannelManager = new PresenceChannelManager(
        this.supabase,
        deviceToken,
        this.config,
        async (status: DeviceStatus) => {
          console.log('Status change callback triggered:', status);
          await this.updateDeviceStatus(status);
          this.lastStatus = status;
          this.missedHeartbeats = 0;
        }
      );

      this.heartbeatManager = await this.presenceInitializer.initialize(
        deviceToken,
        this.presenceChannelManager,
        async (status: DeviceStatus) => await this.updateDeviceStatus(status)
      );

      this.setupCleanup();
      this.isInitialized = true;
      console.log('PresenceManager initialization completed');
    } catch (error) {
      console.error('Error initializing presence:', {
        error,
        deviceToken,
        timestamp: new Date().toISOString()
      });
      await this.reconnect();
    }
  }

  private async updateDeviceStatus(status: DeviceStatus): Promise<void> {
    if (!this.deviceToken) {
      console.log('No device token available for status update');
      return;
    }
    
    try {
      console.log('Updating device status:', {
        status,
        deviceToken: this.deviceToken,
        timestamp: new Date().toISOString()
      });
      
      await this.deviceStatusManager.updateStatus(this.deviceToken, status);
      console.log(`Device status successfully updated to ${status}`);
    } catch (error) {
      console.error('Error updating device status:', {
        error,
        status,
        deviceToken: this.deviceToken,
        timestamp: new Date().toISOString()
      });
      
      this.missedHeartbeats++;
      console.log(`Missed heartbeats: ${this.missedHeartbeats}/${this.MAX_MISSED_HEARTBEATS}`);
      
      if (this.missedHeartbeats >= this.MAX_MISSED_HEARTBEATS) {
        console.log('Too many missed heartbeats, marking device as offline');
        await this.deviceStatusManager.updateStatus(this.deviceToken, 'offline');
        this.lastStatus = 'offline';
        await this.reconnect();
      }
    }
  }

  private async reconnect(): Promise<void> {
    console.log('Attempting to reconnect presence channel...');
    if (this.deviceToken) {
      await this.cleanup();
      console.log(`Waiting ${this.config.reconnectDelay}ms before reconnecting`);
      await new Promise(resolve => setTimeout(resolve, this.config.reconnectDelay));
      await this.initialize(this.deviceToken);
    }
  }

  private setupCleanup(): void {
    const cleanup = async () => {
      console.log('Starting presence cleanup...');
      await this.cleanup();
    };

    window.addEventListener('beforeunload', cleanup);
    window.addEventListener('unload', cleanup);
    console.log('Cleanup event listeners set up');
  }

  async cleanup(): Promise<void> {
    if (!this.isInitialized) {
      console.log('No cleanup needed - not initialized');
      return;
    }

    console.log('Starting presence cleanup...');
    
    if (this.heartbeatManager) {
      this.heartbeatManager.stop();
      console.log('Stopped heartbeat');
    }
    
    if (this.presenceChannelManager && this.deviceToken) {
      await this.updateDeviceStatus('offline');
      await this.presenceChannelManager.cleanup();
    }

    this.deviceToken = null;
    this.presenceChannelManager = null;
    this.isInitialized = false;
    this.lastStatus = 'offline';
    this.missedHeartbeats = 0;
    console.log('Presence cleanup completed');
  }
}