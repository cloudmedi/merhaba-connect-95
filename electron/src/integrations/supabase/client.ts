import { createClient } from '@supabase/supabase-js';
import { createDeviceToken } from './deviceToken';
import { PresenceManager } from './presence/presenceManager';

let presenceManager: PresenceManager | null = null;
let currentDeviceToken: string | null = null;
let isInitializing = false;
let initializationPromise: Promise<any> | null = null;

// Create a single instance of the Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.VITE_SUPABASE_ANON_KEY || '',
  {
    auth: {
      persistSession: true,
      detectSessionInUrl: false,
      autoRefreshToken: false, // Disable auto refresh to prevent recursion
      flowType: 'implicit'
    }
  }
);

async function initSupabase() {
  // If already initializing, return the existing promise
  if (initializationPromise) {
    return initializationPromise;
  }

  // If already initialized, return the client
  if (presenceManager && currentDeviceToken) {
    return supabase;
  }

  initializationPromise = (async () => {
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
          throw new Error('Failed to get MAC address');
        }

        console.log('Creating device token with MAC address:', macAddress);
        const tokenData = await createDeviceToken(macAddress);
        if (!tokenData) {
          throw new Error('Failed to create/get device token');
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
      // Clear the promise so we can retry initialization
      initializationPromise = null;
      throw error;
    }
  })();

  return initializationPromise;
}

// Clean up function to handle cleanup of resources
async function cleanup() {
  if (presenceManager) {
    await presenceManager.cleanup();
    presenceManager = null;
  }
  currentDeviceToken = null;
  initializationPromise = null;
}

export { supabase, initSupabase, cleanup };