import { createClient } from '@supabase/supabase-js';
import { createDeviceToken } from './deviceToken';
import { PresenceManager } from './presence/presenceManager';

let supabaseInstance: ReturnType<typeof createClient> | null = null;
let presenceManager: PresenceManager | null = null;
let isInitialized = false;
let currentDeviceToken: string | null = null;
let cleanupFunctions: (() => void)[] = [];

async function initSupabase() {
  if (isInitialized && supabaseInstance) {
    console.log('Supabase already initialized with token:', currentDeviceToken);
    return supabaseInstance;
  }

  try {
    console.log('Starting Supabase initialization...');
    const envVars = await (window as any).electronAPI.getEnvVars();
    
    if (!envVars.VITE_SUPABASE_URL || !envVars.VITE_SUPABASE_ANON_KEY) {
      console.error('Missing Supabase connection details:', envVars);
      throw new Error('Missing Supabase connection details');
    }

    // Cleanup any existing connections before creating new ones
    cleanup();

    console.log('Creating Supabase client...');
    supabaseInstance = createClient(
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

    presenceManager = new PresenceManager(supabaseInstance, {
      heartbeatInterval: 5000,
      reconnectDelay: 3000
    });

    console.log('Getting MAC address...');
    const macAddress = await (window as any).electronAPI.getMacAddress();
    if (!macAddress) {
      console.error('Failed to get MAC address');
      return supabaseInstance;
    }

    console.log('Creating device token with MAC address:', macAddress);
    const tokenData = await createDeviceToken(macAddress);
    if (!tokenData) {
      console.error('Failed to create/get device token');
      return supabaseInstance;
    }

    console.log('Device token created/retrieved:', tokenData);
    currentDeviceToken = tokenData.token;

    if (presenceManager) {
      console.log('Initializing presence manager with token:', currentDeviceToken);
      await presenceManager.initialize(currentDeviceToken);
      
      // Add cleanup function for presence manager
      cleanupFunctions.push(() => {
        presenceManager?.cleanup();
      });
    }

    // Add cleanup function for auth subscription
    const { data: { subscription } } = supabaseInstance.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
    });
    cleanupFunctions.push(() => {
      subscription.unsubscribe();
    });

    isInitialized = true;
    console.log('Supabase initialization completed successfully');
    return supabaseInstance;
  } catch (error) {
    console.error('Supabase initialization error:', error);
    cleanup();
    throw error;
  }
}

function cleanup() {
  console.log('Cleaning up Supabase connections...');
  cleanupFunctions.forEach(cleanup => cleanup());
  cleanupFunctions = [];
  
  if (presenceManager) {
    presenceManager.cleanup();
    presenceManager = null;
  }

  if (supabaseInstance) {
    supabaseInstance.removeAllChannels();
  }

  isInitialized = false;
  currentDeviceToken = null;
}

// Ensure cleanup on window unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', cleanup);
}

export { supabaseInstance as supabase, initSupabase, cleanup };