import { createClient } from '@supabase/supabase-js';
import { createDeviceToken } from './deviceToken';

let supabase: ReturnType<typeof createClient>;
let presenceChannel: ReturnType<typeof createClient>['channel'];
let heartbeatInterval: NodeJS.Timeout;
let isTrackingPresence = false;

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
    
    const macAddress = await (window as any).electronAPI.getMacAddress();
    if (!macAddress) {
      throw new Error('Could not get MAC address');
    }

    console.log('Creating device token with MAC address:', macAddress);
    const tokenData = await createDeviceToken(macAddress);
    if (!tokenData) {
      throw new Error('Failed to get or create device token');
    }

    console.log('Device token created/retrieved:', tokenData);
    const deviceToken = tokenData.token;

    // Clear existing intervals and channels
    cleanup();

    // Set up device presence channel
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

    // Subscribe to broadcast channel for device status requests
    const broadcastChannel = supabase.channel('device_broadcast')
      .on('broadcast', { event: 'device_added' }, async (payload) => {
        if (payload.token === deviceToken) {
          await updatePresence(deviceToken);
        }
      })
      .subscribe();

    // Start presence heartbeat
    await presenceChannel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await updatePresence(deviceToken);
        
        // Set up heartbeat interval
        heartbeatInterval = setInterval(async () => {
          await updatePresence(deviceToken);
        }, 10000); // Send heartbeat every 10 seconds
      }
    });

    // Update status when window is closing
    window.addEventListener('beforeunload', async () => {
      await cleanup();
    });
    
    return supabase;
  } catch (error) {
    console.error('Supabase initialization error:', error);
    throw error;
  }
}

async function updatePresence(deviceToken: string) {
  try {
    const systemInfo = await (window as any).electronAPI.getSystemInfo();
    isTrackingPresence = true;
    await presenceChannel.track({
      token: deviceToken,
      status: 'online',
      systemInfo,
      lastSeen: new Date().toISOString(),
    });

    // Also update the device record in the database
    await supabase
      .from('devices')
      .update({
        status: 'online',
        system_info: systemInfo,
        last_seen: new Date().toISOString()
      })
      .eq('token', deviceToken);

  } catch (error) {
    console.error('Error updating presence:', error);
  }
}

async function cleanup() {
  isTrackingPresence = false;
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
  }
  if (presenceChannel) {
    const deviceToken = (await createDeviceToken(await (window as any).electronAPI.getMacAddress()))?.token;
    if (deviceToken) {
      // Update device status to offline in the database
      await supabase
        .from('devices')
        .update({
          status: 'offline',
          last_seen: new Date().toISOString()
        })
        .eq('token', deviceToken);

      // Track offline status in presence channel
      await presenceChannel.track({
        token: deviceToken,
        status: 'offline',
        lastSeen: new Date().toISOString(),
      });
    }
    supabase.removeChannel(presenceChannel);
  }
}

export { supabase, initSupabase };