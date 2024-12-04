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

  constructor(private supabase: SupabaseClient, config: PresenceConfig = {}) {
    this.config = {
      heartbeatInterval: config.heartbeatInterval || 5000,
      reconnectDelay: config.reconnectDelay || 3000
    };
    this.deviceStatusManager = new DeviceStatusManager(supabase);
  }

  async initialize(deviceToken: string): Promise<void> {
    console.log('Initializing PresenceManager for device:', deviceToken);
    this.deviceToken = deviceToken;

    try {
      const isValidDevice = await this.deviceStatusManager.verifyDevice(deviceToken);
      if (!isValidDevice) return;

      const deviceChannel = this.deviceStatusManager.setupStatusChannel(deviceToken);

      this.presenceChannelManager = new PresenceChannelManager(
        this.supabase,
        deviceToken,
        this.config,
        (status) => this.deviceStatusManager.updateStatus(deviceToken, status)
      );

      await this.presenceChannelManager.setup();
      this.setupCleanup();

      // Initial status update
      const systemInfo = await (window as any).electronAPI.getSystemInfo();
      await this.deviceStatusManager.updateStatus(deviceToken, 'online', systemInfo);

      // Start heartbeat
      this.heartbeatManager = new HeartbeatManager(
        this.config.heartbeatInterval,
        () => this.updatePresence()
      );
      await this.heartbeatManager.start();

    } catch (error) {
      console.error('Error initializing presence:', error);
      throw error;
    }
  }

  private async updatePresence(): Promise<void> {
    if (!this.deviceToken || !this.presenceChannelManager) return;

    try {
      const systemInfo = await (window as any).electronAPI.getSystemInfo();
      await this.presenceChannelManager.track('online', systemInfo);
      await this.deviceStatusManager.updateStatus(this.deviceToken, 'online', systemInfo);
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
    console.log('Presence cleanup completed');
  }
}