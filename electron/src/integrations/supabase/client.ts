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

    // Only set up presence if device exists
    if (device) {
      console.log('Device found, setting up presence channel');
      await setupPresenceChannel(currentDeviceToken);
    } else {
      console.log('Device not registered yet, skipping presence setup');
    }

    // Update status when window is closing
    window.addEventListener('beforeunload', async (event) => {
      event.preventDefault();
      await cleanup();
    });

    isInitialized = true;
    return supabase;
  } catch (error) {
    console.error('Supabase initialization error:', error);
    throw error;
  }
}

async function setupPresenceChannel(deviceToken: string) {
  if (!deviceToken) return;

  try {
    // Remove existing channel if any
    if (presenceChannel) {
      await supabase.removeChannel(presenceChannel);
    }

    presenceChannel = supabase.channel(`device_${deviceToken}`, {
      config: {
        presence: {
          key: deviceToken,
        },
      }
    });

    presenceChannel
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
      if (status === 'SUBSCRIBED') {
        console.log('Successfully subscribed to presence channel');
        
        // Initial presence update
        await updatePresenceAndStatus(deviceToken);
        
        // Clear existing heartbeat interval if any
        if (heartbeatInterval) {
          clearInterval(heartbeatInterval);
        }
        
        // Set up heartbeat interval with more frequent updates
        heartbeatInterval = setInterval(async () => {
          await updatePresenceAndStatus(deviceToken);
        }, 5000); // Send heartbeat every 5 seconds
      }
    });
  } catch (error) {
    console.error('Error setting up presence channel:', error);
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
    // Try to reconnect if there's an error
    await setupPresenceChannel(deviceToken);
  }
}

async function cleanup() {
  console.log('Starting cleanup process...');
  
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    console.log('Cleared heartbeat interval');
  }
  
  if (presenceChannel && currentDeviceToken) {
    try {
      // Only update status to offline if device exists
      const { data: device } = await supabase
        .from('devices')
        .select('*')
        .eq('token', currentDeviceToken)
        .single();

      if (device) {
        console.log('Updating device status to offline...');
        // Update device status to offline
        await updateDeviceStatus(currentDeviceToken, 'offline', null);
        
        // Track offline status in presence channel
        await presenceChannel.track({
          token: currentDeviceToken,
          status: 'offline',
          lastSeen: new Date().toISOString(),
        });
      }
      
      await supabase.removeChannel(presenceChannel);
      console.log('Removed presence channel');
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }

  currentDeviceToken = null;
  isInitialized = false;
  console.log('Cleanup completed');
}

export { supabase, initSupabase };