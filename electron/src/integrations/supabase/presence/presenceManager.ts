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

  constructor(private supabase: SupabaseClient, config: PresenceConfig = {}) {
    this.config = {
      heartbeatInterval: config.heartbeatInterval || 30000, // 30 saniyeye çıkarıldı
      reconnectDelay: config.reconnectDelay || 5000
    };
    this.deviceStatusManager = new DeviceStatusManager(supabase);
  }

  async initialize(deviceToken: string): Promise<void> {
    if (this.isInitialized) return;
    
    console.log('Initializing PresenceManager for device:', deviceToken);
    this.deviceToken = deviceToken;

    try {
      const isValidDevice = await this.deviceStatusManager.verifyDevice(deviceToken);
      if (!isValidDevice) return;

      this.presenceChannelManager = new PresenceChannelManager(
        this.supabase,
        deviceToken,
        this.config,
        (status) => this.deviceStatusManager.updateStatus(deviceToken, status)
      );

      await this.presenceChannelManager.setup();
      this.setupCleanup();

      // Initial status update
      await this.deviceStatusManager.updateStatus(deviceToken, 'online');

      // Start heartbeat with longer interval
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

  private async updatePresence(): Promise<void> {
    if (!this.deviceToken || !this.presenceChannelManager) return;

    try {
      await this.presenceChannelManager.track('online');
      await this.deviceStatusManager.updateStatus(this.deviceToken, 'online');
    } catch (error) {
      console.error('Error updating presence:', error);
    }
  }

  private setupCleanup(): void {
    window.addEventListener('beforeunload', async (event) => {
      event.preventDefault();
      await this.cleanup();
    });
  }

  async cleanup(): Promise<void> {
    console.log('Starting presence cleanup...');
    
    if (this.heartbeatManager) {
      this.heartbeatManager.stop();
      console.log('Stopped heartbeat');
    }
    
    if (this.presenceChannelManager && this.deviceToken) {
      await this.deviceStatusManager.updateStatus(this.deviceToken, 'offline');
      await this.presenceChannelManager.cleanup();
    }

    this.deviceToken = null;
    this.presenceChannelManager = null;
    this.isInitialized = false;
    console.log('Presence cleanup completed');
  }
}