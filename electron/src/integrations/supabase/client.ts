import { createClient } from '@supabase/supabase-js';
import { createDeviceToken } from './deviceToken';
import { updateDeviceStatus } from './deviceStatus';
import { PresenceManager } from './presence/presenceManager';

let supabase: ReturnType<typeof createClient>;
let presenceManager: PresenceManager;
let isInitialized = false;

async function initSupabase() {
  if (isInitialized) return supabase;

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

    presenceManager = new PresenceManager(supabase);

    const macAddress = await (window as any).electronAPI.getMacAddress();
    if (!macAddress) {
      console.log('No MAC address found, skipping device token creation');
      return supabase;
    }

    console.log('Creating device token with MAC address:', macAddress);
    const tokenData = await createDeviceToken(macAddress);
    if (!tokenData) {
      console.log('No device token created/found, skipping presence setup');
      return supabase;
    }

    // First verify if this device exists in the devices table
    const { data: device } = await supabase
      .from('devices')
      .select('*')
      .eq('token', tokenData.token)
      .single();

    // Only set up presence if device exists
    if (device) {
      console.log('Device found, initializing presence manager');
      await presenceManager.initialize(tokenData.token);
      
      // Update initial device status
      await updateDeviceStatus(tokenData.token, 'online', device.system_info);
    }

    // Handle window close
    window.addEventListener('beforeunload', async (event) => {
      event.preventDefault();
      if (presenceManager) {
        await presenceManager.cleanup();
        await updateDeviceStatus(tokenData.token, 'offline', null);
      }
    });

    isInitialized = true;
    return supabase;
  } catch (error) {
    console.error('Supabase initialization error:', error);
    throw error;
  }
}

export { supabase, initSupabase };