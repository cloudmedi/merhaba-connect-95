import { createClient } from '@supabase/supabase-js';

let supabase: ReturnType<typeof createClient>;

async function initSupabase() {
  if (supabase) return supabase;

  try {
    // Get environment variables
    const envVars = await (window as any).electronAPI.getEnvVars();
    console.log('Environment variables received:', envVars);
    
    if (!envVars.VITE_SUPABASE_URL || !envVars.VITE_SUPABASE_ANON_KEY) {
      console.error('Missing Supabase environment variables:', envVars);
      throw new Error('Missing Supabase connection details. Please check your .env file.');
    }

    // Create Supabase client
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
    
    // Get device ID
    const deviceId = await (window as any).electronAPI.getDeviceId();
    console.log('Device ID:', deviceId);
    
    // First create the device if it doesn't exist
    const { data: existingDevice, error: deviceError } = await supabase
      .from('devices')
      .select('id')
      .eq('id', deviceId)
      .single();

    if (deviceError || !existingDevice) {
      const { error: insertDeviceError } = await supabase
        .from('devices')
        .insert({
          id: deviceId,
          name: 'Electron App',
          category: 'player',
          status: 'online',
          system_info: {},
          schedule: {}
        });

      if (insertDeviceError) {
        console.error('Error creating device:', insertDeviceError);
        throw insertDeviceError;
      }
    }
    
    // Now check/create device token
    const { data: existingToken, error: tokenError } = await supabase
      .from('device_tokens')
      .select('*')
      .eq('device_id', deviceId)
      .eq('status', 'active')
      .maybeSingle();

    if (tokenError) {
      console.error('Error checking device token:', tokenError);
      throw tokenError;
    }

    if (!existingToken) {
      // Generate new token
      const token = Math.random().toString(36).substring(2, 8).toUpperCase();
      const expirationDate = new Date();
      expirationDate.setFullYear(expirationDate.getFullYear() + 1);

      const { error: insertError } = await supabase
        .from('device_tokens')
        .insert({
          token,
          device_id: deviceId,
          status: 'active',
          expires_at: expirationDate.toISOString()
        });

      if (insertError) {
        console.error('Error creating device token:', insertError);
        throw insertError;
      }
    }
    
    console.log('Supabase initialized successfully');
    return supabase;
  } catch (error) {
    console.error('Supabase initialization error:', error);
    throw error;
  }
}

export { initSupabase };