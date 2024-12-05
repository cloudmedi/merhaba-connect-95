import { SupabaseClient } from '@supabase/supabase-js';
import { PresenceConfig } from './types';
import { DeviceStatusManager } from './deviceStatusManager';
import { PresenceChannelManager } from './presenceChannelManager';
import { HeartbeatManager } from './heartbeatManager';

export class PresenceManager {
  private deviceToken: string | null = null;
  private deviceStatusManager: DeviceStatusManager;
  private presenceChannelManager: PresenceChannelManager | null = null;
  private heartbeatManager: HeartbeatManager | null = null;
  private config: Required<PresenceConfig>;
  private isInitialized = false;
  private lastStatus: 'online' | 'offline' = 'offline';
  private missedHeartbeats = 0;
  private readonly MAX_MISSED_HEARTBEATS = 2;

  constructor(private supabase: SupabaseClient, config: PresenceConfig = {}) {
    console.log('Initializing PresenceManager with config:', config);
    
    this.config = {
      heartbeatInterval: config.heartbeatInterval || 5000,
      reconnectDelay: config.reconnectDelay || 3000
    };
    
    this.deviceStatusManager = new DeviceStatusManager(supabase);
    console.log('PresenceManager constructed with config:', this.config);
  }

  async initialize(deviceToken: string): Promise<void> {
    if (this.isInitialized) {
      console.log('PresenceManager already initialized');
      return;
    }
    
    console.log('Initializing PresenceManager for device:', deviceToken);
    this.deviceToken = deviceToken;
    this.missedHeartbeats = 0;

    try {
      console.log('Verifying device token');
      const isValidDevice = await this.deviceStatusManager.verifyDevice(deviceToken);
      if (!isValidDevice) {
        console.error('Invalid device token:', deviceToken);
        return;
      }

      console.log('Creating PresenceChannelManager');
      this.presenceChannelManager = new PresenceChannelManager(
        this.supabase,
        deviceToken,
        this.config,
        async (status) => {
          console.log('Status change callback triggered:', status);
          await this.updateDeviceStatus(status);
          this.lastStatus = status;
          this.missedHeartbeats = 0;
        }
      );

      console.log('Setting up presence channel');
      await this.presenceChannelManager.setup();
      this.setupCleanup();

      console.log('Initial status update');
      await this.updateDeviceStatus('online');
      this.lastStatus = 'online';

      console.log('Creating HeartbeatManager');
      this.heartbeatManager = new HeartbeatManager(
        this.config.heartbeatInterval,
        () => this.updatePresence()
      );
      
      console.log('Starting heartbeat');
      await this.heartbeatManager.start();

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

  private async updateDeviceStatus(status: 'online' | 'offline'): Promise<void> {
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

  private async updatePresence(): Promise<void> {
    if (!this.deviceToken || !this.presenceChannelManager) {
      console.log('Cannot update presence: missing token or channel manager');
      return;
    }

    try {
      console.log('Updating presence status');
      await this.presenceChannelManager.track('online');
      this.missedHeartbeats = 0;
      console.log('Presence status updated successfully');
    } catch (error) {
      console.error('Error updating presence:', {
        error,
        deviceToken: this.deviceToken,
        timestamp: new Date().toISOString()
      });
      
      this.missedHeartbeats++;
      console.log(`Missed heartbeats: ${this.missedHeartbeats}/${this.MAX_MISSED_HEARTBEATS}`);
      
      if (this.missedHeartbeats >= this.MAX_MISSED_HEARTBEATS) {
        console.log('Too many missed heartbeats, attempting to reconnect...');
        await this.reconnect();
      }
    }
  }

  private async reconnect(): Promise<void> {
    console.log('Attempting to reconnect presence channel...');
    if (this.presenceChannelManager) {
      await this.cleanup();
      console.log(`Waiting ${this.config.reconnectDelay}ms before reconnecting`);
      await new Promise(resolve => setTimeout(resolve, this.config.reconnectDelay));
      await this.initialize(this.deviceToken!);
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