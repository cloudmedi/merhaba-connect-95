import { SupabaseClient } from '@supabase/supabase-js';
import { DeviceStatusManager } from './deviceStatusManager';
import { PresenceChannelManager } from './presenceChannelManager';
import { HeartbeatManager } from './heartbeatManager';
import { PresenceConfig } from './types';

export class PresenceInitializer {
  constructor(
    private supabase: SupabaseClient,
    private deviceStatusManager: DeviceStatusManager,
    private config: Required<PresenceConfig>
  ) {}

  async initialize(
    deviceToken: string,
    presenceChannelManager: PresenceChannelManager,
    updateDeviceStatus: (status: 'online' | 'offline') => Promise<void>
  ): Promise<HeartbeatManager | null> {
    console.log('Verifying device token');
    const isValidDevice = await this.deviceStatusManager.verifyDevice(deviceToken);
    if (!isValidDevice) {
      console.error('Invalid device token:', deviceToken);
      return null;
    }

    console.log('Setting up presence channel');
    await presenceChannelManager.setup();

    console.log('Initial status update');
    await updateDeviceStatus('online');

    const channel = presenceChannelManager.getChannel();
    if (!channel) {
      console.error('Failed to create HeartbeatManager: channel not available');
      return null;
    }

    console.log('Creating HeartbeatManager');
    const heartbeatManager = new HeartbeatManager(
      channel,
      deviceToken,
      this.config.heartbeatInterval
    );
    
    console.log('Starting heartbeat');
    heartbeatManager.start();

    return heartbeatManager;
  }
}