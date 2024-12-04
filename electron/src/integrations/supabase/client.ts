import { createClient } from '@supabase/supabase-js';
import { createDeviceToken } from './deviceToken';

let supabase: ReturnType<typeof createClient>;
let presenceChannel: ReturnType<typeof createClient>['channel'];
let heartbeatInterval: NodeJS.Timeout;

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

    // Clear existing intervals if any
    if (heartbeatInterval) clearInterval(heartbeatInterval);
    if (presenceChannel) supabase.removeChannel(presenceChannel);

    // Set up device presence channel
    presenceChannel = supabase.channel('device_status')
      .on('presence', { event: 'sync' }, () => {
        console.log('Presence state synced:', presenceChannel.presenceState());
      })
      .on('presence', { event: 'join' }, async ({ key, newPresences }) => {
        console.log('Device joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, async ({ key, leftPresences }) => {
        console.log('Device left:', key, leftPresences);
      });

    // Subscribe to broadcast channel for device status requests
    const broadcastChannel = supabase.channel('device_broadcast')
      .on('broadcast', { event: 'status_check' }, async (payload) => {
        if (payload.token === deviceToken) {
          const systemInfo = await (window as any).electronAPI.getSystemInfo();
          await presenceChannel.track({
            token: deviceToken,
            status: 'online',
            systemInfo,
            lastSeen: new Date().toISOString(),
          });
        }
      })
      .subscribe();

    // Start presence heartbeat
    await presenceChannel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        const systemInfo = await (window as any).electronAPI.getSystemInfo();
        
        // Send initial presence
        await presenceChannel.track({
          token: deviceToken,
          status: 'online',
          systemInfo,
          lastSeen: new Date().toISOString(),
        });

        // Set up heartbeat interval
        heartbeatInterval = setInterval(async () => {
          const systemInfo = await (window as any).electronAPI.getSystemInfo();
          await presenceChannel.track({
            token: deviceToken,
            status: 'online',
            systemInfo,
            lastSeen: new Date().toISOString(),
          });
        }, 10000); // Send heartbeat every 10 seconds
      }
    });

    // Update status when window is closing
    window.addEventListener('beforeunload', async () => {
      if (presenceChannel) {
        await presenceChannel.track({
          token: deviceToken,
          status: 'offline',
          lastSeen: new Date().toISOString(),
        });
        supabase.removeChannel(presenceChannel);
      }
      if (heartbeatInterval) clearInterval(heartbeatInterval);
    });
    
    return supabase;
  } catch (error) {
    console.error('Supabase initialization error:', error);
    throw error;
  }
}

export { supabase, initSupabase, createDeviceToken };