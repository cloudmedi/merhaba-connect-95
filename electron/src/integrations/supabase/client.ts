import { createClient } from '@supabase/supabase-js';
import { createDeviceToken } from './deviceToken';
import { PresenceManager } from './presence/presenceManager';

let supabase: ReturnType<typeof createClient>;
let presenceManager: PresenceManager;
let isInitialized = false;
let currentDeviceToken: string | null = null;

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

    presenceManager = new PresenceManager(supabase, {
      heartbeatInterval: 5000,
      reconnectDelay: 3000
    });

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

    console.log('Device token created/retrieved:', tokenData);
    currentDeviceToken = tokenData.token;

    await presenceManager.initialize(currentDeviceToken);
    isInitialized = true;

    return supabase;
  } catch (error) {
    console.error('Supabase initialization error:', error);
    throw error;
  }
}

export { supabase, initSupabase };