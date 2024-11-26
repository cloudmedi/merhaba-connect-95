import { createClient } from '@supabase/supabase-js';

let supabase: ReturnType<typeof createClient>;

async function updateDeviceStatus(deviceToken: string, status: 'online' | 'offline', systemInfo: any) {
  const supabase = await initSupabase();
  
  try {
    // Only update existing device status
    const { error: updateError } = await supabase
      .from('devices')
      .update({
        status: status,
        system_info: systemInfo || {},
        last_seen: new Date().toISOString(),
      })
      .eq('token', deviceToken);

    if (updateError) throw updateError;

    // Set up heartbeat interval
    if (status === 'online') {
      setInterval(async () => {
        const systemInfo = await (window as any).electronAPI.getSystemInfo();
        await supabase
          .from('devices')
          .update({
            last_seen: new Date().toISOString(),
            system_info: systemInfo
          })
          .eq('token', deviceToken);
      }, 30000); // Send heartbeat every 30 seconds
    }
  } catch (error) {
    console.error('Error updating device status:', error);
    throw error;
  }
}

async function initSupabase() {
  if (supabase) return supabase;

  try {
    const envVars = await (window as any).electronAPI.getEnvVars();
    
    if (!envVars.VITE_SUPABASE_URL || !envVars.VITE_SUPABASE_ANON_KEY) {
      throw new Error('Missing Supabase connection details');
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

    const deviceToken = localStorage.getItem('deviceToken');
    if (!deviceToken) {
      console.log('No device token found');
      return supabase;
    }

    // Set initial online status if we have a token
    const systemInfo = await (window as any).electronAPI.getSystemInfo();
    await updateDeviceStatus(deviceToken, 'online', systemInfo);

    // Handle window close/reload
    window.addEventListener('beforeunload', async () => {
      const systemInfo = await (window as any).electronAPI.getSystemInfo();
      await updateDeviceStatus(deviceToken, 'offline', systemInfo);
    });

    return supabase;
  } catch (error) {
    console.error('Supabase initialization error:', error);
    throw error;
  }
}

export { initSupabase, updateDeviceStatus };