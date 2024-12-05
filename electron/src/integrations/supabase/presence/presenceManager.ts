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

  constructor(private supabase: SupabaseClient, config: PresenceConfig = {}) {
    this.config = {
      heartbeatInterval: config.heartbeatInterval || 30000,
      reconnectDelay: config.reconnectDelay || 5000
    };
    this.deviceStatusManager = new DeviceStatusManager(supabase);
  }

  async initialize(deviceToken: string): Promise<void> {
    if (this.isInitialized) {
      console.log('PresenceManager already initialized');
      return;
    }
    
    console.log('Initializing PresenceManager for device:', deviceToken);
    this.deviceToken = deviceToken;

    try {
      const isValidDevice = await this.deviceStatusManager.verifyDevice(deviceToken);
      if (!isValidDevice) {
        console.error('Invalid device token');
        return;
      }

      this.presenceChannelManager = new PresenceChannelManager(
        this.supabase,
        deviceToken,
        this.config,
        async (status) => {
          if (this.lastStatus !== status) {
            await this.updateDeviceStatus(status);
            this.lastStatus = status;
          }
        }
      );

      await this.presenceChannelManager.setup();
      this.setupCleanup();

      // Initial status update
      await this.updateDeviceStatus('online');
      this.lastStatus = 'online';

      this.heartbeatManager = new HeartbeatManager(
        this.config.heartbeatInterval,
        () => this.updatePresence()
      );
      await this.heartbeatManager.start();

      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing presence:', error);
      throw error;
    }
  }

  private async updateDeviceStatus(status: 'online' | 'offline'): Promise<void> {
    if (!this.deviceToken) return;
    
    try {
      await this.deviceStatusManager.updateStatus(this.deviceToken, status);
      console.log(`Device status updated to ${status}`);
    } catch (error) {
      console.error('Error updating device status:', error);
    }
  }

  private async updatePresence(): Promise<void> {
    if (!this.deviceToken || !this.presenceChannelManager) return;

    try {
      await this.presenceChannelManager.track('online');
    } catch (error) {
      console.error('Error updating presence:', error);
      // Attempt to reconnect on error
      await this.reconnect();
    }
  }

  private async reconnect(): Promise<void> {
    console.log('Attempting to reconnect presence channel...');
    if (this.presenceChannelManager) {
      await this.presenceChannelManager.setup();
    }
  }

  private setupCleanup(): void {
    const cleanup = async () => {
      console.log('Starting presence cleanup...');
      await this.cleanup();
    };

    window.addEventListener('beforeunload', cleanup);
    window.addEventListener('unload', cleanup);
  }

  async cleanup(): Promise<void> {
    if (!this.isInitialized) return;

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
    console.log('Presence cleanup completed');
  }
}