import { createClient } from '@supabase/supabase-js';
import { createDeviceToken, updateDeviceSystemInfo } from './deviceToken';
import { updateDeviceStatus } from './deviceStatus';

let supabase: ReturnType<typeof createClient>;
let systemInfoInterval: NodeJS.Timeout;
let deviceCheckInterval: NodeJS.Timeout;

async function initSupabase() {
  if (supabase) return supabase;

  try {
    console.log('Initializing Supabase...');
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
    
    console.log('Getting MAC address...');
    const macAddress = await (window as any).electronAPI.getMacAddress();
    if (!macAddress) {
      throw new Error('Could not get MAC address');
    }

    console.log('Creating device token with MAC address:', macAddress);

    // Get or create device token
    const tokenData = await createDeviceToken(macAddress);
    if (!tokenData) {
      throw new Error('Failed to get or create device token');
    }

    console.log('Device token created/retrieved:', tokenData);
    const deviceToken = tokenData.token;

    // Clear existing intervals if any
    if (systemInfoInterval) clearInterval(systemInfoInterval);
    if (deviceCheckInterval) clearInterval(deviceCheckInterval);

    // Set up periodic system info updates
    systemInfoInterval = setInterval(async () => {
      try {
        console.log('Updating system info...');
        await updateDeviceSystemInfo(deviceToken);
      } catch (error) {
        console.error('Error in periodic system info update:', error);
      }
    }, 30000); // Update every 30 seconds

    // Set up periodic device check
    deviceCheckInterval = setInterval(async () => {
      try {
        console.log('Checking for device registration...');
        const { data: device, error: deviceError } = await supabase
          .from('devices')
          .select('id')
          .eq('token', deviceToken)
          .maybeSingle();

        console.log('Device check result:', { device, deviceError });

        if (device) {
          console.log('Device found, updating status...');
          const systemInfo = await (window as any).electronAPI.getSystemInfo();
          await updateDeviceStatus(deviceToken, 'online', systemInfo);
        } else {
          console.log('No device found with token:', deviceToken);
        }
      } catch (error) {
        console.error('Error checking device registration:', error);
      }
    }, 10000); // Check every 10 seconds

    // Initial device check
    console.log('Checking for existing device...');
    const { data: device, error: deviceError } = await supabase
      .from('devices')
      .select('id')
      .eq('token', deviceToken)
      .maybeSingle();

    console.log('Device check result:', { device, deviceError });

    if (deviceError) {
      console.error('Error checking device:', deviceError);
    }

    if (device) {
      console.log('Device found, updating status...');
      // Set initial online status
      const systemInfo = await (window as any).electronAPI.getSystemInfo();
      await updateDeviceStatus(deviceToken, 'online', systemInfo);

      // Update status when window is closing
      window.addEventListener('beforeunload', async (event) => {
        event.preventDefault();
        console.log('Window closing, updating device status to offline...');
        if (systemInfoInterval) clearInterval(systemInfoInterval);
        if (deviceCheckInterval) clearInterval(deviceCheckInterval);
        await updateDeviceStatus(deviceToken, 'offline', systemInfo);
      });
    } else {
      console.log('No device found with token:', deviceToken);
    }
    
    return supabase;
  } catch (error) {
    console.error('Supabase initialization error:', error);
    throw error;
  }
}

export { supabase, initSupabase, createDeviceToken, updateDeviceStatus };