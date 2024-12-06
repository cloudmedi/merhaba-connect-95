import WebSocket from 'ws';
import { createClient } from '@supabase/supabase-js';
import { BrowserWindow } from 'electron';

export class WebSocketManager {
  private ws: WebSocket | null = null;
  private supabaseUrl: string;
  private supabaseClient: any;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 5000;
  private win: BrowserWindow | null;

  constructor(deviceToken: string, win: BrowserWindow | null) {
    console.log('Initializing WebSocketManager with token:', deviceToken);
    this.win = win;

    this.supabaseUrl = process.env.VITE_SUPABASE_URL || '';
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
    
    if (!this.supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase environment variables');
      return;
    }

    this.supabaseClient = createClient(this.supabaseUrl, supabaseKey);
    this.initializeConnection(deviceToken);
  }

  private async initializeConnection(deviceToken: string) {
    try {
      console.log('Initializing WebSocket connection...');
      if (!this.supabaseClient) {
        throw new Error('Supabase client not initialized');
      }

      // Direkt olarak device token'ı kullanarak bağlantı kur
      const { data: tokenData, error } = await this.supabaseClient
        .from('device_tokens')
        .select('token')
        .eq('mac_address', deviceToken)
        .in('status', ['active', 'used'])
        .single();

      if (error || !tokenData) {
        console.error('Could not find active device token:', error);
        return;
      }

      console.log('Found active device token:', tokenData.token);
      this.connect(tokenData.token);
    } catch (error) {
      console.error('Error initializing connection:', error);
    }
  }

  private async connect(token: string) {
    try {
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
        return;
      }

      const wsUrl = `${this.supabaseUrl.replace('https://', 'wss://')}/functions/v1/sync-playlist?token=${token}`;
      console.log('Connecting to WebSocket URL:', wsUrl);
      
      this.ws = new WebSocket(wsUrl);

      this.ws.on('open', () => {
        console.log('WebSocket connection opened successfully');
        this.reconnectAttempts = 0;
      });

      this.ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });

      this.ws.on('close', () => {
        console.log('WebSocket connection closed');
        this.reconnectAttempts++;
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          console.log(`Attempting to reconnect in ${this.reconnectDelay}ms...`);
          setTimeout(() => this.connect(token), this.reconnectDelay);
        }
      });
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      this.reconnectAttempts++;
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        console.log(`Attempting to reconnect in ${this.reconnectDelay}ms...`);
        setTimeout(() => this.connect(token), this.reconnectDelay);
      }
    }
  }

  public async sendPlaylist(playlist: any) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.error('WebSocket connection not ready');
      return { success: false, error: 'WebSocket connection not ready' };
    }

    try {
      console.log('Sending playlist via WebSocket:', playlist);
      this.ws.send(JSON.stringify({
        type: 'sync_playlist',
        payload: {
          playlist
        }
      }));

      return { success: true };
    } catch (error) {
      console.error('Error sending playlist:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  public async disconnect() {
    if (this.ws) {
      console.log('Disconnecting WebSocket');
      this.ws.close();
      this.ws = null;
    }
  }
}