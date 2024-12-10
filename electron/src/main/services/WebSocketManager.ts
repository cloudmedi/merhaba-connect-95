import WebSocket from 'ws';
import { BrowserWindow } from 'electron';

export class WebSocketManager {
  private ws: WebSocket | null = null;
  private reconnectInterval: NodeJS.Timeout | null = null;
  private isConnected: boolean = false;
  private supabaseUrl: string;
  private supabaseKey: string;
  private deviceToken: string;

  constructor(deviceToken: string, private win: BrowserWindow | null) {
    console.log('WebSocketManager: Başlatılıyor', { deviceToken });
    
    this.deviceToken = deviceToken;
    this.supabaseUrl = process.env.VITE_SUPABASE_URL || '';
    this.supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
    
    if (!this.supabaseUrl || !this.supabaseKey) {
      console.error('WebSocketManager: Supabase bilgileri eksik');
      return;
    }

    this.initializeWebSocket();
    this.startConnectionCheck();
  }

  private startConnectionCheck() {
    console.log('Bağlantı kontrol döngüsü başlatılıyor');
    this.reconnectInterval = setInterval(() => {
      if (!this.isConnected) {
        console.log('Bağlantı koptu, yeniden bağlanılıyor...');
        this.initializeWebSocket();
      }
    }, 30000);
  }

  private initializeWebSocket() {
    try {
      const wsUrl = `${this.supabaseUrl.replace('https://', 'wss://')}/realtime/v1/websocket?apikey=${this.supabaseKey}&vsn=1.0.0`;
      console.log('WebSocket bağlantısı başlatılıyor:', wsUrl);

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket bağlantısı kuruldu');
        this.isConnected = true;

        // Cihaza özel kanala abone ol
        const joinMessage = {
          topic: `realtime:device_${this.deviceToken}`,
          event: "phx_join",
          payload: { 
            device_token: this.deviceToken,
            timestamp: new Date().toISOString()
          },
          ref: Date.now()
        };
        
        this.ws?.send(JSON.stringify(joinMessage));
        console.log('Kanal katılım mesajı gönderildi:', joinMessage);
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data.toString());
          console.log('WebSocket mesajı alındı:', data);

          if (data.event === "broadcast" && 
              data.payload?.deviceToken === this.deviceToken) {
            console.log('Playlist sync mesajı alındı:', data.payload);
            
            if (this.win) {
              this.win.webContents.send('playlist-received', data.payload.playlist);
            }
          }
        } catch (error) {
          console.error('Mesaj işleme hatası:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket hatası:', error);
        this.isConnected = false;
      };

      this.ws.onclose = () => {
        console.log('WebSocket bağlantısı kapandı');
        this.isConnected = false;
      };

    } catch (error) {
      console.error('WebSocket başlatma hatası:', error);
      this.isConnected = false;
    }
  }

  public async disconnect() {
    console.log('WebSocket kapatılıyor');
    if (this.reconnectInterval) {
      clearInterval(this.reconnectInterval);
      this.reconnectInterval = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.isConnected = false;
    }
  }
}