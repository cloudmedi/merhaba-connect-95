import { createClient } from '@supabase/supabase-js';
import { createDeviceToken } from './deviceToken';
import { PresenceManager } from './presence/presenceManager';

let supabase: ReturnType<typeof createClient>;
let presenceManager: PresenceManager;
let isInitialized = false;
export let currentDeviceToken: string | null = null;  // Export edildi

async function initSupabase() {
  if (isInitialized) {
    console.log('Supabase already initialized with token:', currentDeviceToken);
    return supabase;
  }

  try {
    console.log('Starting Supabase initialization...');
    const envVars = await (window as any).electronAPI.getEnvVars();
    
    if (!envVars.VITE_SUPABASE_URL || !envVars.VITE_SUPABASE_ANON_KEY) {
      console.error('Missing Supabase connection details:', envVars);
      throw new Error('Missing Supabase connection details');
    }

    console.log('Creating Supabase client...');
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

    console.log('Getting MAC address...');
    const macAddress = await (window as any).electronAPI.getMacAddress();
    if (!macAddress) {
      console.error('Failed to get MAC address');
      return supabase;
    }

    console.log('Creating device token with MAC address:', macAddress);
    const tokenData = await createDeviceToken(macAddress);
    if (!tokenData || typeof tokenData.token !== 'string') {
      console.error('Failed to create/get device token');
      return supabase;
    }

    console.log('Device token created/retrieved:', tokenData);
    currentDeviceToken = tokenData.token;

    // Register device with main process
    await (window as any).electronAPI.registerDevice({ token: currentDeviceToken });
    console.log('Device registered with main process');

    if (currentDeviceToken && tokenData.status !== 'expired') {
      console.log('Initializing presence manager with token:', currentDeviceToken);
      await presenceManager.initialize(currentDeviceToken);
      isInitialized = true;
    } else {
      console.log('Token is expired, skipping presence manager initialization');
    }

    console.log('Supabase initialization completed successfully');
    return supabase;
  } catch (error) {
    console.error('Supabase initialization error:', error);
    throw error;
  }
}

export { supabase, initSupabase };