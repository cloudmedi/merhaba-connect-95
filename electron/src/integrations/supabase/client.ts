import { createClient } from '@supabase/supabase-js';
import { createDeviceToken, updateDeviceSystemInfo } from './deviceToken';
import { updateDeviceStatus } from './deviceStatus';

let supabase: ReturnType<typeof createClient>;
let systemInfoInterval: NodeJS.Timeout;

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
    const { data: tokenData, error: tokenError } = await createDeviceToken(macAddress);

    if (tokenError) throw tokenError;
    if (!tokenData) throw new Error('Failed to get or create device token');

    const deviceToken = tokenData.token;

    // Set up periodic system info updates
    if (systemInfoInterval) {
      clearInterval(systemInfoInterval);
    }

    systemInfoInterval = setInterval(async () => {
      try {
        await updateDeviceSystemInfo(deviceToken);
      } catch (error) {
        console.error('Error in periodic system info update:', error);
      }
    }, 30000); // Update every 30 seconds

    // Get device info and set up realtime subscription
    const { data: device } = await supabase
      .from('devices')
      .select('id')
      .eq('token', deviceToken)
      .maybeSingle();

    if (device) {
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

      // Set initial online status
      const systemInfo = await (window as any).electronAPI.getSystemInfo();
      await updateDeviceStatus(deviceToken, 'online', systemInfo);

      // Update status when window is closing
      window.addEventListener('beforeunload', async (event) => {
        event.preventDefault();
        if (systemInfoInterval) {
          clearInterval(systemInfoInterval);
        }
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