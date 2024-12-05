export class HeartbeatManager {
  private interval: NodeJS.Timeout | null = null;
  private isRunning = false;
  private consecutiveFailures = 0;
  private readonly MAX_CONSECUTIVE_FAILURES = 3;

  constructor(
    private intervalMs: number,
    private onHeartbeat: () => Promise<void>
  ) {}

  async start(): Promise<void> {
    if (this.isRunning) {
      console.log('Heartbeat already running');
      return;
    }

    this.isRunning = true;
    this.consecutiveFailures = 0;
    
    if (this.interval) {
      clearInterval(this.interval);
    }

    await this.sendHeartbeat();
    
    this.interval = setInterval(async () => {
      if (this.isRunning) {
        await this.sendHeartbeat();
      }
    }, this.intervalMs);
  }

  private async sendHeartbeat(): Promise<void> {
    try {
      await this.onHeartbeat();
      this.consecutiveFailures = 0;
    } catch (error) {
      console.error('Heartbeat failed:', error);
      this.consecutiveFailures++;

      if (this.consecutiveFailures >= this.MAX_CONSECUTIVE_FAILURES) {
        console.log('Too many consecutive heartbeat failures, stopping heartbeat');
        this.stop();
      }
    }
  }

  stop(): void {
    this.isRunning = false;
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.consecutiveFailures = 0;
  }
}