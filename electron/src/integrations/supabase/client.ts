import { createClient } from '@supabase/supabase-js';

let supabase: ReturnType<typeof createClient>;
let statusUpdateInterval: NodeJS.Timeout;

async function createDeviceToken(macAddress: string) {
  const supabase = await initSupabase();
  const token = Math.random().toString(36).substring(2, 8).toUpperCase();
  const expirationDate = new Date();
  expirationDate.setFullYear(expirationDate.getFullYear() + 1);

  const { data: tokenData, error: tokenError } = await supabase
    .from('device_tokens')
    .insert({
      token,
      mac_address: macAddress,
      status: 'active',
      expires_at: expirationDate.toISOString()
    })
    .select()
    .maybeSingle();

  if (tokenError) throw tokenError;
  if (!tokenData) throw new Error('Failed to create device token');

  return tokenData;
}

async function updateDeviceStatus(deviceToken: string, status: 'online' | 'offline', systemInfo: any) {
  try {
    const { data: existingDevice, error: checkError } = await supabase
      .from('devices')
      .select('id, name')
      .eq('token', deviceToken)
      .maybeSingle();

    if (checkError) throw checkError;

    const deviceData = {
      status,
      system_info: systemInfo || {},
      last_seen: new Date().toISOString(),
    };

    // Only create new device if it doesn't exist
    if (!existingDevice) {
      const { error: createError } = await supabase
        .from('devices')
        .insert({
          name: `Device ${deviceToken}`,
          category: 'player',
          token: deviceToken,
          status: 'offline', // Always start as offline until manager activates
          system_info: systemInfo || {},
          last_seen: new Date().toISOString(),
          schedule: {}
        });

      if (createError) throw createError;
    } else {
      // Update existing device status
      const { error: updateError } = await supabase
        .from('devices')
        .update(deviceData)
        .eq('token', deviceToken);

      if (updateError) throw updateError;
    }
  } catch (error) {
    console.error('Error updating device status:', error);
    throw error;
  }
}

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
    const { data: existingToken, error: tokenError } = await supabase
      .from('device_tokens')
      .select('token')
      .eq('mac_address', macAddress)
      .eq('status', 'active')
      .maybeSingle();

    if (tokenError) throw tokenError;

    let deviceToken;
    if (existingToken) {
      deviceToken = existingToken.token;
    } else {
      const tokenData = await createDeviceToken(macAddress);
      deviceToken = tokenData.token;
    }

    // Set initial status as offline until manager activates
    const systemInfo = await (window as any).electronAPI.getSystemInfo();
    await updateDeviceStatus(deviceToken, 'offline', systemInfo);

    // Subscribe to device status changes
    const channel = supabase.channel('device_status')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'devices',
          filter: `token=eq.${deviceToken}`
        },
        async (payload) => {
          console.log('Device status changed:', payload);
          // Handle status changes here
        }
      )
      .subscribe();

    // Set offline status when app closes
    window.addEventListener('beforeunload', async (event) => {
      event.preventDefault();
      if (statusUpdateInterval) {
        clearInterval(statusUpdateInterval);
      }
      const systemInfo = await (window as any).electronAPI.getSystemInfo();
      await updateDeviceStatus(deviceToken, 'offline', systemInfo);
    });
    
    return supabase;
  } catch (error) {
    console.error('Supabase initialization error:', error);
    throw error;
  }
}

export { initSupabase, createDeviceToken };