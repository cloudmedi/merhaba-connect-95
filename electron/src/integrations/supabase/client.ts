import { createClient } from '@supabase/supabase-js';

let supabase: ReturnType<typeof createClient>;

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

    // Set up heartbeat interval when device is registered
    const channel = supabase.channel('online-status')
      .on('presence', { event: 'sync' }, () => {
        console.log('Presence sync');
      })
      .subscribe();

    // Handle window close/reload
    window.addEventListener('beforeunload', async () => {
      const macAddress = await (window as any).electronAPI.getMacAddress();
      if (!macAddress) return;

      const { data: deviceToken } = await supabase
        .from('device_tokens')
        .select('token')
        .eq('mac_address', macAddress)
        .eq('status', 'active')
        .maybeSingle();

      if (deviceToken?.token) {
        await supabase
          .from('devices')
          .update({ 
            status: 'offline',
            last_seen: new Date().toISOString()
          })
          .eq('token', deviceToken.token);
      }

      channel.unsubscribe();
    });

    return supabase;
  } catch (error) {
    console.error('Supabase initialization error:', error);
    throw error;
  }
}

export { initSupabase };