import { BrowserWindow } from 'electron';
import { WebSocketConnectionManager } from './WebSocketConnectionManager';
import { TokenValidationManager } from './TokenValidationManager';

export class WebSocketManager {
  private connectionManager: WebSocketConnectionManager | null = null;
  private tokenValidator: TokenValidationManager;

  constructor(
    private deviceToken: string,
    private win: BrowserWindow | null
  ) {
    this.tokenValidator = new TokenValidationManager(deviceToken);
    this.initialize();
  }

  private async initialize() {
    try {
      console.log('Initializing WebSocket manager...');

      const isValid = await this.tokenValidator.validateToken();
      if (!isValid) {
        console.error('Invalid or expired device token');
        if (this.win) {
          this.win.webContents.send('websocket-error', 'Invalid or expired device token');
        }
        return;
      }

      const supabaseUrl = process.env.VITE_SUPABASE_URL;
      const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        console.error('Missing Supabase configuration');
        return;
      }

      this.connectionManager = new WebSocketConnectionManager(
        this.deviceToken,
        this.win,
        supabaseUrl,
        supabaseKey
      );

      await this.connectionManager.connect();
    } catch (error) {
      console.error('Error initializing WebSocket manager:', error);
    }
  }

  async disconnect() {
    if (this.connectionManager) {
      this.connectionManager.disconnect();
      this.connectionManager = null;
    }
  }
}