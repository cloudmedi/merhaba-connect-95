import { createClient } from '@supabase/supabase-js';
import { createDeviceToken, validateDeviceToken } from './deviceToken';
import { updateDeviceStatus } from './deviceStatus';
import { RealtimeChannel } from '@supabase/supabase-js';

let supabase: ReturnType<typeof createClient>;
let statusChannel: RealtimeChannel;

async function initSupabase() {
  if (supabase) return supabase;

  try {
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
    if (!macAddress) throw new Error('Could not get MAC address');

    // Get or create device token
    const tokenData = await createDeviceToken(macAddress);
    if (!tokenData?.token) {
      throw new Error('Failed to create/get device token');
    }

    // Validate token
    const isValid = await validateDeviceToken(tokenData.token, macAddress);
    if (!isValid) {
      throw new Error('Invalid or expired token');
    }

    // Set up realtime channel for device status
    setupRealtimeChannel(tokenData.token);

    // Set up initial status and heartbeat
    const systemInfo = await (window as any).electronAPI.getSystemInfo();
    await updateDeviceStatus(tokenData.token, 'online', systemInfo);

    // Set up heartbeat interval with retry mechanism
    const heartbeatInterval = setInterval(async () => {
      try {
        const currentSystemInfo = await (window as any).electronAPI.getSystemInfo();
        await updateDeviceStatus(tokenData.token, 'online', currentSystemInfo);
      } catch (error) {
        console.error('Heartbeat update failed:', error);
        // Try to reconnect realtime channel
        await reconnectRealtimeChannel(tokenData.token);
      }
    }, 30000); // Every 30 seconds

    // Update status when window is closing
    window.addEventListener('beforeunload', async (event) => {
      clearInterval(heartbeatInterval);
      event.preventDefault();
      try {
        const finalSystemInfo = await (window as any).electronAPI.getSystemInfo();
        await updateDeviceStatus(tokenData.token, 'offline', finalSystemInfo);
        if (statusChannel) {
          await statusChannel.unsubscribe();
        }
      } catch (error) {
        console.error('Failed to update offline status:', error);
      }
    });

    return supabase;
  } catch (error) {
    console.error('Supabase initialization error:', error);
    throw error;
  }
}

async function setupRealtimeChannel(token: string) {
  try {
    // Unsubscribe from existing channel if any
    if (statusChannel) {
      await statusChannel.unsubscribe();
    }

    statusChannel = supabase.channel(`device_status:${token}`)
      .on('presence', { event: 'sync' }, () => {
        console.log('Status sync successful');
      })
      .on('presence', { event: 'join' }, () => {
        console.log('Device joined status channel');
      })
      .on('presence', { event: 'leave' }, () => {
        console.log('Device left status channel');
      })
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'devices',
          filter: `token=eq.${token}`
        },
        (payload) => {
          console.log('Device status changed:', payload);
        }
      );

    await statusChannel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        const systemInfo = await (window as any).electronAPI.getSystemInfo();
        await statusChannel.track({
          token,
          status: 'online',
          system_info: systemInfo,
          last_seen: new Date().toISOString()
        });
      }
    });
  } catch (error) {
    console.error('Failed to setup realtime channel:', error);
    // Retry after 5 seconds
    setTimeout(() => setupRealtimeChannel(token), 5000);
  }
}

async function reconnectRealtimeChannel(token: string) {
  try {
    await setupRealtimeChannel(token);
  } catch (error) {
    console.error('Failed to reconnect realtime channel:', error);
  }
}

export { supabase, initSupabase };