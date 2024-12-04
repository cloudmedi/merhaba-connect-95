import { createClient } from '@supabase/supabase-js';
import { createDeviceToken, updateDeviceSystemInfo } from './deviceToken';
import { updateDeviceStatus } from './deviceStatus';

let supabase: ReturnType<typeof createClient>;
let systemInfoInterval: NodeJS.Timeout;
let realtimeChannel: ReturnType<typeof createClient>['channel'];

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
            eventsPerSecond: 1
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
    if (realtimeChannel) supabase.removeChannel(realtimeChannel);

    // Set up periodic system info updates
    systemInfoInterval = setInterval(async () => {
      try {
        console.log('Updating system info...');
        await updateDeviceSystemInfo(deviceToken);
      } catch (error) {
        console.error('Error in periodic system info update:', error);
      }
    }, 30000); // Update every 30 seconds

    // Set up realtime subscription for device status
    realtimeChannel = supabase.channel('device_status')
      .on(
        'presence',
        { event: 'sync' },
        () => {
          console.log('Initial presence state received');
        }
      )
      .on(
        'presence',
        { event: 'join' },
        async ({ key, newPresences }) => {
          console.log('Join event:', key, newPresences);
          const systemInfo = await (window as any).electronAPI.getSystemInfo();
          await updateDeviceStatus(deviceToken, 'online', systemInfo);
        }
      )
      .on(
        'presence',
        { event: 'leave' },
        async ({ key, leftPresences }) => {
          console.log('Leave event:', key, leftPresences);
          const systemInfo = await (window as any).electronAPI.getSystemInfo();
          await updateDeviceStatus(deviceToken, 'offline', systemInfo);
        }
      );

    // Track device presence
    await realtimeChannel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        const systemInfo = await (window as any).electronAPI.getSystemInfo();
        await updateDeviceStatus(deviceToken, 'online', systemInfo);
      }
    });

    // Update status when window is closing
    window.addEventListener('beforeunload', async (event) => {
      event.preventDefault();
      console.log('Window closing, updating device status to offline...');
      if (systemInfoInterval) clearInterval(systemInfoInterval);
      if (realtimeChannel) supabase.removeChannel(realtimeChannel);
      const systemInfo = await (window as any).electronAPI.getSystemInfo();
      await updateDeviceStatus(deviceToken, 'offline', systemInfo);
    });
    
    return supabase;
  } catch (error) {
    console.error('Supabase initialization error:', error);
    throw error;
  }
}

export { supabase, initSupabase, createDeviceToken, updateDeviceStatus };