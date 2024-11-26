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
    
    // MAC adresine ait aktif token var mı kontrol et
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
    
    if (existingToken) {
      console.log('Found existing token:', existingToken);
      return supabase;
    }
    
    // Eğer token yoksa yeni oluştur
    const tokenData = await createDeviceToken(macAddress);
    console.log('Created new token:', tokenData);
    
    return supabase;
  } catch (error) {
    console.error('Supabase initialization error:', error);
    throw error;
  }
}

let supabase: ReturnType<typeof createClient>;

export { initSupabase, createDeviceToken };