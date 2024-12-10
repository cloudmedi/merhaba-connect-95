import { RealtimeChannel } from '@supabase/supabase-js';

export class HeartbeatManager {
  private heartbeatInterval: NodeJS.Timeout | null = null;

  constructor(
    private channel: RealtimeChannel,
    private deviceToken: string,
    private intervalMs: number
  ) {}

  start(): void {
    if (this.heartbeatInterval) {
      this.stop();
    }

    this.heartbeatInterval = setInterval(() => {
      this.sendHeartbeat();
    }, this.intervalMs);

    this.sendHeartbeat(); // Initial heartbeat
  }

  stop(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private async sendHeartbeat(): Promise<void> {
    try {
      await this.channel.track({
        token: this.deviceToken,
        online_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error sending heartbeat:', error);
    }
  }
}