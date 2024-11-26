import { createClient } from '@supabase/supabase-js';
import { createDeviceToken, validateDeviceToken } from './deviceToken';
import { updateDeviceStatus } from './deviceStatus';

let supabase: ReturnType<typeof createClient>;

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
    
    const macAddress = await (window as any).electronAPI.getMacAddress();
    if (!macAddress) throw new Error('Could not get MAC address');

    // Get or create device token
    const tokenData = await createDeviceToken(macAddress);
    if (!tokenData?.token) {
      throw new Error('Failed to create/get device token');
    }

    // Validate token
    const isValid = await validateDeviceToken(tokenData.token, macAddress);
    if (!isValid) {
      throw new Error('Invalid or expired token');
    }

    // Set up initial status and heartbeat
    const systemInfo = await (window as any).electronAPI.getSystemInfo();
    await updateDeviceStatus(tokenData.token, 'online', systemInfo);

    // Set up heartbeat interval
    const heartbeatInterval = setInterval(async () => {
      try {
        const currentSystemInfo = await (window as any).electronAPI.getSystemInfo();
        await updateDeviceStatus(tokenData.token, 'online', currentSystemInfo);
      } catch (error) {
        console.error('Heartbeat update failed:', error);
      }
    }, 30000); // Every 30 seconds

    // Update status when window is closing
    window.addEventListener('beforeunload', async (event) => {
      clearInterval(heartbeatInterval);
      event.preventDefault();
      try {
        const finalSystemInfo = await (window as any).electronAPI.getSystemInfo();
        await updateDeviceStatus(tokenData.token, 'offline', finalSystemInfo);
      } catch (error) {
        console.error('Failed to update offline status:', error);
      }
    });

    return supabase;
  } catch (error) {
    console.error('Supabase initialization error:', error);
    throw error;
  }
}

export { supabase, initSupabase };