import { createClient } from '@supabase/supabase-js';
import { createDeviceToken, validateDeviceToken } from './deviceToken';
import { updateDeviceStatus } from './deviceStatus';
import { RealtimeChannel } from '@supabase/supabase-js';
import { toast } from 'sonner';

let supabase: ReturnType<typeof createClient>;
let statusChannel: RealtimeChannel;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

async function initSupabase() {
  if (supabase) return supabase;

  try {
    const envVars = await (window as any).electronAPI.getEnvVars();
    
    if (!envVars.VITE_SUPABASE_URL || !envVars.VITE_SUPABASE_ANON_KEY) {
      throw new Error('Supabase bağlantı bilgileri eksik');
    }

    supabase = createClient(
      envVars.VITE_SUPABASE_URL,
      envVars.VITE_SUPABASE_ANON_KEY,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false
        },
        realtime: {
          params: {
            eventsPerSecond: 10
          }
        }
      }
    );
    
    const macAddress = await (window as any).electronAPI.getMacAddress();
    if (!macAddress) throw new Error('MAC adresi alınamadı');

    const tokenData = await createDeviceToken(macAddress);
    if (!tokenData?.token) {
      throw new Error('Device token oluşturulamadı');
    }

    const isValid = await validateDeviceToken(tokenData.token, macAddress);
    if (!isValid) {
      throw new Error('Geçersiz token');
    }

    await setupRealtimeChannel(tokenData.token);

    const systemInfo = await (window as any).electronAPI.getSystemInfo();
    const statusUpdate = await updateDeviceStatus(tokenData.token, 'online', systemInfo);
    
    if (!statusUpdate.success) {
      toast.error('Cihaz durumu güncellenemedi: ' + statusUpdate.error);
    }

    // Heartbeat interval
    const heartbeatInterval = setInterval(async () => {
      try {
        const currentSystemInfo = await (window as any).electronAPI.getSystemInfo();
        const heartbeatUpdate = await updateDeviceStatus(tokenData.token, 'online', currentSystemInfo);
        
        if (!heartbeatUpdate.success) {
          throw new Error(heartbeatUpdate.error);
        }

        // Başarılı heartbeat sonrası reconnect sayacını sıfırla
        reconnectAttempts = 0;
      } catch (error) {
        console.error('Heartbeat hatası:', error);
        handleConnectionError(tokenData.token);
      }
    }, 30000);

    // Pencere kapanırken cleanup
    window.addEventListener('beforeunload', async (event) => {
      clearInterval(heartbeatInterval);
      event.preventDefault();
      
      try {
        const finalSystemInfo = await (window as any).electronAPI.getSystemInfo();
        await updateDeviceStatus(tokenData.token, 'offline', finalSystemInfo);
        if (statusChannel) {
          await statusChannel.unsubscribe();
        }
      } catch (error) {
        console.error('Çıkış durumu güncellenirken hata:', error);
      }
    });

    return supabase;
  } catch (error) {
    console.error('Supabase başlatma hatası:', error);
    throw error;
  }
}

async function setupRealtimeChannel(token: string) {
  try {
    if (statusChannel) {
      await statusChannel.unsubscribe();
    }

    statusChannel = supabase.channel(`device_status:${token}`)
      .on('presence', { event: 'sync' }, () => {
        console.log('Status sync başarılı');
      })
      .on('presence', { event: 'join' }, () => {
        console.log('Cihaz kanala katıldı');
        toast.success('Realtime bağlantısı kuruldu');
      })
      .on('presence', { event: 'leave' }, () => {
        console.log('Cihaz kanaldan ayrıldı');
        toast.warning('Realtime bağlantısı kesildi');
      })
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'devices',
          filter: `token=eq.${token}`
        },
        (payload) => {
          console.log('Cihaz durumu değişti:', payload);
        }
      );

    await statusChannel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        const systemInfo = await (window as any).electronAPI.getSystemInfo();
        await statusChannel.track({
          token,
          status: 'online',
          system_info: systemInfo,
          last_seen: new Date().toISOString()
        });
      }
    });

    // Başarılı bağlantı sonrası reconnect sayacını sıfırla
    reconnectAttempts = 0;
  } catch (error) {
    console.error('Realtime kanal kurulumu hatası:', error);
    handleConnectionError(token);
  }
}

async function handleConnectionError(token: string) {
  reconnectAttempts++;
  
  if (reconnectAttempts <= MAX_RECONNECT_ATTEMPTS) {
    const backoffTime = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
    console.log(`Yeniden bağlanmayı deniyor... Deneme ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}`);
    
    setTimeout(async () => {
      try {
        await setupRealtimeChannel(token);
      } catch (error) {
        console.error('Yeniden bağlanma hatası:', error);
      }
    }, backoffTime);
  } else {
    toast.error('Bağlantı kurulamadı. Lütfen ağ bağlantınızı kontrol edin.');
    console.error('Maksimum yeniden bağlanma denemesi aşıldı');
  }
}

export { supabase, initSupabase };