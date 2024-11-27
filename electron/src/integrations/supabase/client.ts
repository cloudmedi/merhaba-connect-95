import { createClient } from '@supabase/supabase-js';
import { createDeviceToken } from './deviceToken';
import { updateDeviceStatus } from './deviceStatus';

let supabase: ReturnType<typeof createClient>;
let deviceStatusChannel: any;

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

    // Set up realtime subscription for device status
    if (deviceStatusChannel) {
      await supabase.removeChannel(deviceStatusChannel);
    }

    deviceStatusChannel = supabase.channel(`device_status_${deviceToken}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'devices',
          filter: `token=eq.${deviceToken}`
        },
        async (payload: any) => {
          console.log('Device status change detected:', payload);
          
          if (payload.new && payload.new.status) {
            try {
              const systemInfo = await (window as any).electronAPI.getSystemInfo();
              await updateDeviceStatus(deviceToken, payload.new.status, systemInfo);
            } catch (error) {
              console.error('Error handling status change:', error);
            }
          }
        }
      )
      .subscribe((status: string) => {
        console.log('Realtime subscription status:', status);
      });

    // Set initial online status
    try {
      const systemInfo = await (window as any).electronAPI.getSystemInfo();
      await updateDeviceStatus(deviceToken, 'online', systemInfo);
    } catch (error) {
      console.error('Error setting initial status:', error);
    }

    // Update status when window is closing
    window.addEventListener('beforeunload', async (event) => {
      event.preventDefault();
      try {
        const systemInfo = await (window as any).electronAPI.getSystemInfo();
        await updateDeviceStatus(deviceToken, 'offline', systemInfo);
      } catch (error) {
        console.error('Error updating offline status:', error);
      }
    });

    return supabase;
  } catch (error) {
    console.error('Supabase initialization error:', error);
    throw error;
  }
}

export { supabase, initSupabase, createDeviceToken, updateDeviceStatus };