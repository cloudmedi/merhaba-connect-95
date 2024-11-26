import { createClient } from '@supabase/supabase-js';

let supabase: ReturnType<typeof createClient>;

async function createDeviceToken(macAddress: string) {
  const supabase = await initSupabase();
  const token = Math.random().toString(36).substring(2, 8).toUpperCase();
  const expirationDate = new Date();
  expirationDate.setFullYear(expirationDate.getFullYear() + 1);

  // First check if there's an existing active token
  const { data: existingToken, error: checkError } = await supabase
    .from('device_tokens')
    .select('token')
    .eq('mac_address', macAddress)
    .eq('status', 'active')
    .maybeSingle();

  if (checkError) throw checkError;
  
  // If token exists, return it
  if (existingToken) {
    return existingToken;
  }

  // If no active token exists, create a new one
  const { data: tokenData, error: tokenError } = await supabase
    .from('device_tokens')
    .insert({
      token,
      mac_address: macAddress,
      status: 'active',
      expires_at: expirationDate.toISOString()
    })
    .select()
    .single();

  if (tokenError) throw tokenError;
  if (!tokenData) throw new Error('Failed to create device token');

  return tokenData;
}

async function updateDeviceStatus(deviceToken: string, status: 'online' | 'offline', systemInfo: any) {
  const supabase = await initSupabase();
  
  try {
    // First verify the token is valid and active
    const { data: tokenData, error: tokenError } = await supabase
      .from('device_tokens')
      .select('*')
      .eq('token', deviceToken)
      .eq('status', 'active')
      .single();

    if (tokenError || !tokenData) {
      throw new Error('Invalid or expired token');
    }

    // Check if token is expired
    if (new Date(tokenData.expires_at) < new Date()) {
      throw new Error('Token has expired');
    }

    const { data: existingDevice, error: checkError } = await supabase
      .from('devices')
      .select('id, name, status')
      .eq('token', deviceToken)
      .maybeSingle();

    if (checkError) throw checkError;

    if (!existingDevice) {
      // Create new device
      const { error: createError } = await supabase
        .from('devices')
        .insert({
          name: `Device ${deviceToken}`,
          category: 'player',
          token: deviceToken,
          status: status,
          system_info: systemInfo || {},
          last_seen: new Date().toISOString(),
          schedule: {}
        });

      if (createError) throw createError;
      return;
    }

    // Update existing device
    const { error: updateError } = await supabase
      .from('devices')
      .update({
        status,
        system_info: systemInfo || {},
        last_seen: new Date().toISOString(),
      })
      .eq('token', deviceToken);

    if (updateError) throw updateError;
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
      .select('token, expires_at')
      .eq('mac_address', macAddress)
      .eq('status', 'active')
      .maybeSingle();

    if (tokenError) throw tokenError;

    let deviceToken;
    if (existingToken) {
      // Check if token is expired
      if (new Date(existingToken.expires_at) < new Date()) {
        // Create new token if expired
        const tokenData = await createDeviceToken(macAddress);
        deviceToken = tokenData.token;
      } else {
        deviceToken = existingToken.token;
      }
    } else {
      const tokenData = await createDeviceToken(macAddress);
      deviceToken = tokenData.token;
    }

    // Subscribe to device status changes
    const channel = supabase.channel(`device_status_${deviceToken}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'devices',
          filter: `token=eq.${deviceToken}`
        },
        async (payload: any) => {
          console.log('Device status changed:', payload);
          
          if (payload.new && payload.new.status) {
            const systemInfo = await (window as any).electronAPI.getSystemInfo();
            await updateDeviceStatus(deviceToken, payload.new.status, systemInfo);
          }
        }
      )
      .subscribe((status: string) => {
        console.log('Realtime subscription status:', status);
      });

    // Set initial online status and update on window events
    const systemInfo = await (window as any).electronAPI.getSystemInfo();
    await updateDeviceStatus(deviceToken, 'online', systemInfo);

    // Update status when window is closing
    window.addEventListener('beforeunload', async (event) => {
      event.preventDefault();
      const systemInfo = await (window as any).electronAPI.getSystemInfo();
      await updateDeviceStatus(deviceToken, 'offline', systemInfo);
    });
    
    return supabase;
  } catch (error) {
    console.error('Supabase initialization error:', error);
    throw error;
  }
}

export { initSupabase, createDeviceToken, updateDeviceStatus };