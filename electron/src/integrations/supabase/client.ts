import { createClient } from '@supabase/supabase-js';

async function createDeviceToken(deviceId: string) {
  const supabase = await initSupabase();
  const token = Math.random().toString(36).substring(2, 8).toUpperCase();
  const expirationDate = new Date();
  expirationDate.setFullYear(expirationDate.getFullYear() + 1);

  const { data: tokenData, error: tokenError } = await supabase
    .from('device_tokens')
    .insert({
      token,
      device_id: deviceId,
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

async function initSupabase() {
  if (supabase) return supabase;

  try {
    const envVars = await (window as any).electronAPI.getEnvVars();
    console.log('Environment variables received:', envVars);
    
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
        }
      }
    );
    
    const macAddress = await (window as any).electronAPI.getMacAddress();
    console.log('MAC Address:', macAddress);
    
    if (!macAddress) {
      throw new Error('Could not get MAC address');
    }

    // Önce MAC adresi ile eşleşen bir cihaz var mı kontrol et
    const { data: existingDevice, error: deviceError } = await supabase
      .from('devices')
      .select('id')
      .eq('system_info->mac_address', macAddress)
      .maybeSingle();

    if (deviceError) {
      console.error('Error checking existing device:', deviceError);
      throw deviceError;
    }

    let deviceId = existingDevice?.id;

    // Eğer cihaz yoksa yeni cihaz kaydı oluştur
    if (!deviceId) {
      const { data: newDevice, error: createError } = await supabase
        .from('devices')
        .insert({
          name: 'Offline Player',
          category: 'player',
          system_info: { mac_address: macAddress }
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating device:', createError);
        throw createError;
      }

      deviceId = newDevice.id;
    }
    
    // Device ID ile aktif token var mı kontrol et
    const { data: existingToken, error: tokenError } = await supabase
      .from('device_tokens')
      .select('token')
      .eq('device_id', deviceId)
      .eq('status', 'active')
      .maybeSingle();
    
    if (tokenError) {
      console.error('Error checking existing token:', tokenError);
      throw tokenError;
    }
    
    if (existingToken) {
      console.log('Found existing token:', existingToken);
      return supabase;
    }
    
    // Eğer token yoksa yeni oluştur
    const tokenData = await createDeviceToken(deviceId);
    console.log('Created new token:', tokenData);
    
    return supabase;
  } catch (error) {
    console.error('Supabase initialization error:', error);
    throw error;
  }
}

let supabase: ReturnType<typeof createClient>;

export { initSupabase, createDeviceToken };