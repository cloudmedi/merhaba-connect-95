import { RealtimeChannel } from '@supabase/supabase-js';

interface HeartbeatError {
  name: string;
  message: string;
  stack?: string;
}

export class HeartbeatManager {
  private interval: NodeJS.Timeout | null = null;
  private heartbeatInterval: number;
  private lastHeartbeat: Date | null = null;
  private isActive: boolean = false;

  constructor(
    private channel: RealtimeChannel,
    private deviceToken: string,
    heartbeatInterval: number = 5000
  ) {
    this.heartbeatInterval = heartbeatInterval;
  }

  start() {
    if (this.interval) {
      return;
    }

    this.isActive = true;
    this.sendHeartbeat();
    this.interval = setInterval(() => this.sendHeartbeat(), this.heartbeatInterval);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.isActive = false;
  }

  private async sendHeartbeat() {
    if (!this.isActive) {
      return;
    }

    try {
      const currentTime = new Date();
      await this.channel.send({
        type: 'broadcast',
        event: 'heartbeat',
        payload: {
          deviceToken: this.deviceToken,
          timestamp: currentTime.toISOString()
        }
      });
      this.lastHeartbeat = currentTime;
    } catch (error) {
      const typedError = error as Error;
      const heartbeatError: HeartbeatError = {
        name: typedError?.name || 'Unknown Error',
        message: typedError?.message || 'An unknown error occurred',
        stack: typedError?.stack
      };
      console.error('Heartbeat error:', heartbeatError);
    }
  }

  getLastHeartbeat(): Date | null {
    return this.lastHeartbeat;
  }

  isRunning(): boolean {
    return this.isActive;
  }
}