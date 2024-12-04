import { createClient } from '@supabase/supabase-js';
import { createDeviceToken } from './deviceToken';
import { updateDeviceStatus } from './deviceStatus';

let supabase: ReturnType<typeof createClient>;
let presenceChannel: ReturnType<typeof createClient>['channel'];
let heartbeatInterval: NodeJS.Timeout;
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

    // Clear existing intervals and channels
    await cleanup();

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

    // First verify if this device exists in the devices table
    const { data: device } = await supabase
      .from('devices')
      .select('*')
      .eq('token', currentDeviceToken)
      .single();

    if (!device) {
      console.log('Device not registered in devices table, skipping presence setup');
      return supabase;
    }

    // Set up device presence channel only if device exists
    presenceChannel = supabase.channel('device_status')
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        console.log('Presence state synced:', state);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('Device joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('Device left:', key, leftPresences);
      });

    // Subscribe to presence channel and start heartbeat
    await presenceChannel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED' && currentDeviceToken) {
        // Initial presence update
        await updatePresenceAndStatus(currentDeviceToken);
        
        // Set up heartbeat interval
        heartbeatInterval = setInterval(async () => {
          if (currentDeviceToken) {
            await updatePresenceAndStatus(currentDeviceToken);
          }
        }, 10000); // Send heartbeat every 10 seconds
      }
    });

    // Update status when window is closing
    window.addEventListener('beforeunload', async () => {
      await cleanup();
    });

    isInitialized = true;
    return supabase;
  } catch (error) {
    console.error('Supabase initialization error:', error);
    throw error;
  }
}

async function updatePresenceAndStatus(deviceToken: string) {
  try {
    // Check if device exists before updating presence
    const { data: device } = await supabase
      .from('devices')
      .select('*')
      .eq('token', deviceToken)
      .single();

    if (!device) {
      console.log('Device not found, skipping presence update');
      return;
    }

    const systemInfo = await (window as any).electronAPI.getSystemInfo();

    // Update presence only if device exists
    await presenceChannel.track({
      token: deviceToken,
      status: 'online',
      systemInfo,
      lastSeen: new Date().toISOString(),
    });

    // Update device status in database
    await updateDeviceStatus(deviceToken, 'online', systemInfo);

  } catch (error) {
    console.error('Error updating presence and status:', error);
  }
}

async function cleanup() {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
  }
  
  if (presenceChannel && currentDeviceToken) {
    try {
      // Update device status to offline
      await updateDeviceStatus(currentDeviceToken, 'offline', null);
      
      // Track offline status in presence channel
      await presenceChannel.track({
        token: currentDeviceToken,
        status: 'offline',
        lastSeen: new Date().toISOString(),
      });
      
      await supabase.removeChannel(presenceChannel);
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }

  currentDeviceToken = null;
  isInitialized = false;
}

export { supabase, initSupabase };