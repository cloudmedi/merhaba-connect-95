import { createClient } from '@supabase/supabase-js';

async function createDeviceToken(macAddress: string) {
  const supabase = await initSupabase();
  const token = Math.random().toString(36).substring(2, 8).toUpperCase();
  const expirationDate = new Date();
  expirationDate.setFullYear(expirationDate.getFullYear() + 1);

  const { data: tokenData, error: tokenError } = await supabase
    .from('device_tokens')
    .insert({
      token,
      mac_address: macAddress,
      status: 'active',
      expires_at: expirationDate.toISOString()
    })
    .select()
    .maybeSingle();

  if (tokenError) {
    console.error('Error creating token:', tokenError);
    throw tokenError;
  }

  if (!tokenData) {
    throw new Error('Failed to create device token');
  }

  return tokenData;
}

async function updateDeviceStatus(supabase: any, deviceId: string, status: 'online' | 'offline', systemInfo: any) {
  try {
    const { error } = await supabase
      .from('devices')
      .update({
        status,
        system_info: systemInfo,
        last_seen: new Date().toISOString()
      })
      .eq('mac_address', deviceId); // MAC adresini kullanarak cihazı güncelle

    if (error) {
      console.error('Error updating device status:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error updating device status:', error);
    throw error;
  }
}

let statusUpdateInterval: NodeJS.Timeout;

async function initSupabase() {
  if (supabase) return supabase;

  try {
    const envVars = await (window as any).electronAPI.getEnvVars();
    
    if (!envVars.VITE_SUPABASE_URL || !envVars.VITE_SUPABASE_ANON_KEY) {
      throw new Error('Missing Supabase connection details. Please check your .env file.');
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
    console.log('MAC Address:', macAddress);
    
    if (!macAddress) {
      throw new Error('Could not get MAC address');
    }

    // Mevcut aktif token kontrolü
    const { data: existingToken, error: tokenError } = await supabase
      .from('device_tokens')
      .select('token')
      .eq('mac_address', macAddress)
      .eq('status', 'active')
      .maybeSingle();

    if (tokenError) {
      console.error('Error checking existing token:', tokenError);
      throw tokenError;
    }

    // Durum güncelleme işlemlerini başlat
    const startStatusUpdates = async () => {
      // İlk sistem bilgilerini al ve durumu güncelle
      const systemInfo = await (window as any).electronAPI.getSystemInfo();
      await updateDeviceStatus(supabase, macAddress, 'online', systemInfo);

      // Varolan interval'i temizle
      if (statusUpdateInterval) {
        clearInterval(statusUpdateInterval);
      }

      // Yeni interval başlat
      statusUpdateInterval = setInterval(async () => {
        const updatedSystemInfo = await (window as any).electronAPI.getSystemInfo();
        await updateDeviceStatus(supabase, macAddress, 'online', updatedSystemInfo);
      }, 15000); // Her 15 saniyede bir güncelle
    };

    if (existingToken) {
      console.log('Found existing token:', existingToken);
      await startStatusUpdates();
    } else {
      // Yeni token oluştur
      const tokenData = await createDeviceToken(macAddress);
      console.log('Created new token:', tokenData);
      await startStatusUpdates();
    }

    // Uygulama kapanırken offline durumuna geç
    window.addEventListener('beforeunload', async () => {
      if (statusUpdateInterval) {
        clearInterval(statusUpdateInterval);
      }
      const systemInfo = await (window as any).electronAPI.getSystemInfo();
      await updateDeviceStatus(supabase, macAddress, 'offline', systemInfo);
    });
    
    return supabase;
  } catch (error) {
    console.error('Supabase initialization error:', error);
    throw error;
  }
}

let supabase: ReturnType<typeof createClient>;

export { initSupabase, createDeviceToken };