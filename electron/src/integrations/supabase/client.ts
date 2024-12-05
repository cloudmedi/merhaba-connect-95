import { createClient } from '@supabase/supabase-js';
import { createDeviceToken } from './deviceToken';
import { PresenceManager } from './presence/presenceManager';

let presenceManager: PresenceManager;
let currentDeviceToken: string | null = null;

// Create a single instance of the Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.VITE_SUPABASE_ANON_KEY || '',
  {
    auth: {
      persistSession: true,
      detectSessionInUrl: false
    }
  }
);

async function initSupabase() {
  try {
    console.log('Starting Supabase initialization...');
    const envVars = await (window as any).electronAPI.getEnvVars();
    
    if (!envVars.VITE_SUPABASE_URL || !envVars.VITE_SUPABASE_ANON_KEY) {
      console.error('Missing Supabase connection details:', envVars);
      throw new Error('Missing Supabase connection details');
    }

    if (!presenceManager) {
      presenceManager = new PresenceManager(supabase, {
        heartbeatInterval: 5000,
        reconnectDelay: 3000
      });
    }

    if (!currentDeviceToken) {
      console.log('Getting MAC address...');
      const macAddress = await (window as any).electronAPI.getMacAddress();
      if (!macAddress) {
        console.error('Failed to get MAC address');
        return supabase;
      }

      console.log('Creating device token with MAC address:', macAddress);
      const tokenData = await createDeviceToken(macAddress);
      if (!tokenData) {
        console.error('Failed to create/get device token');
        return supabase;
      }

      console.log('Device token created/retrieved:', tokenData);
      currentDeviceToken = tokenData.token;
    }

    if (currentDeviceToken && presenceManager) {
      console.log('Initializing presence manager with token:', currentDeviceToken);
      await presenceManager.initialize(currentDeviceToken);
    }

    console.log('Supabase initialization completed successfully');
    return supabase;
  } catch (error) {
    console.error('Supabase initialization error:', error);
    throw error;
  }
}

export { supabase, initSupabase };