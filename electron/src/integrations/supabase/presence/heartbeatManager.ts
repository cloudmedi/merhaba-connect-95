export class HeartbeatManager {
  private interval: NodeJS.Timeout | null = null;
  private isRunning = false;
  private consecutiveFailures = 0;
  private readonly MAX_CONSECUTIVE_FAILURES = 2;
  private lastHeartbeatTime: number = 0;

  constructor(
    private intervalMs: number,
    private onHeartbeat: () => Promise<void>
  ) {
    console.log('HeartbeatManager initialized with interval:', intervalMs, 'ms');
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      console.log('Heartbeat already running, skipping start');
      return;
    }

    console.log('Starting heartbeat manager');
    this.isRunning = true;
    this.consecutiveFailures = 0;
    this.lastHeartbeatTime = Date.now();
    
    if (this.interval) {
      console.log('Clearing existing interval');
      clearInterval(this.interval);
    }

    await this.sendHeartbeat();
    
    this.interval = setInterval(async () => {
      if (this.isRunning) {
        const timeSinceLastHeartbeat = Date.now() - this.lastHeartbeatTime;
        console.log(`Time since last heartbeat: ${timeSinceLastHeartbeat}ms`);
        await this.sendHeartbeat();
      }
    }, this.intervalMs);

    console.log('Heartbeat interval started');
  }

  private async sendHeartbeat(): Promise<void> {
    try {
      console.log('Sending heartbeat...');
      console.log('Current consecutive failures:', this.consecutiveFailures);
      
      const startTime = Date.now();
      await this.onHeartbeat();
      const endTime = Date.now();
      
      console.log(`Heartbeat successful! Took ${endTime - startTime}ms`);
      this.lastHeartbeatTime = Date.now();
      this.consecutiveFailures = 0;
    } catch (error) {
      this.consecutiveFailures++;
      console.error('Heartbeat failed:', error);
      console.error(`Consecutive failures: ${this.consecutiveFailures}/${this.MAX_CONSECUTIVE_FAILURES}`);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });

      if (this.consecutiveFailures >= this.MAX_CONSECUTIVE_FAILURES) {
        console.log('Too many consecutive heartbeat failures, stopping heartbeat');
        this.stop();
      }
    }
  }

  stop(): void {
    console.log('Stopping heartbeat manager');
    this.isRunning = false;
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.consecutiveFailures = 0;
    console.log('Heartbeat manager stopped');
  }
}