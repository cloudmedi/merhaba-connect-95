export class HeartbeatManager {
  private interval: NodeJS.Timeout | null = null;

  constructor(
    private intervalMs: number,
    private onHeartbeat: () => Promise<void>
  ) {}

  async start(): Promise<void> {
    if (this.interval) {
      clearInterval(this.interval);
    }

    await this.onHeartbeat();
    
    this.interval = setInterval(async () => {
      await this.onHeartbeat();
    }, this.intervalMs);
  }

  stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}