import { createClient } from '@supabase/supabase-js';
import { createDeviceToken } from './deviceToken';
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
    const { data: existingToken, error: tokenError } = await supabase
      .from('device_tokens')
      .select('token, expires_at')
      .eq('mac_address', macAddress)
      .eq('status', 'active')
      .maybeSingle();

    if (tokenError) throw tokenError;

    let deviceToken;
    if (existingToken) {
      if (new Date(existingToken.expires_at) < new Date()) {
        const tokenData = await createDeviceToken(macAddress);
        deviceToken = tokenData.token;
      } else {
        deviceToken = existingToken.token;
      }
    } else {
      const tokenData = await createDeviceToken(macAddress);
      deviceToken = tokenData.token;
    }

    // Get device info
    const { data: device } = await supabase
      .from('devices')
      .select('id')
      .eq('token', deviceToken)
      .maybeSingle();

    if (device) {
      // Enable REPLICA IDENTITY FULL for realtime
      const channel = supabase.channel('device_status')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'devices',
            filter: `token=eq.${deviceToken}`
          },
          async (payload: any) => {
            console.log('Device status changed:', payload);
            
            if (payload.new && payload.new.status) {
              const systemInfo = await (window as any).electronAPI.getSystemInfo();
              await updateDeviceStatus(deviceToken, payload.new.status, systemInfo);
            }
          }
        )
        .subscribe((status: string) => {
          console.log('Realtime subscription status:', status);
        });

      // Set initial online status and update system info
      const systemInfo = await (window as any).electronAPI.getSystemInfo();
      await updateDeviceStatus(deviceToken, 'online', systemInfo);

      // Update status when window is closing
      window.addEventListener('beforeunload', async (event) => {
        event.preventDefault();
        await updateDeviceStatus(deviceToken, 'offline', systemInfo);
      });
    }
    
    return supabase;
  } catch (error) {
    console.error('Supabase initialization error:', error);
    throw error;
  }
}

export { supabase, initSupabase, createDeviceToken, updateDeviceStatus };