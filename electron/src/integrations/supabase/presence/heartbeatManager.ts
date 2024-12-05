export class HeartbeatManager {
  private interval: NodeJS.Timeout | null = null;
  private isRunning = false;

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
    
    if (this.interval) {
      clearInterval(this.interval);
    }

    await this.onHeartbeat();
    
    this.interval = setInterval(async () => {
      if (this.isRunning) {
        await this.onHeartbeat();
      }
    }, this.intervalMs);
  }

  stop(): void {
    this.isRunning = false;
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}