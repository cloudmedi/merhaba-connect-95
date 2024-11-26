import { createClient } from '@supabase/supabase-js';

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

  if (tokenError) {
    console.error('Error creating token:', tokenError);
    throw tokenError;
  }

  if (!tokenData) {
    throw new Error('Failed to create device token');
  }

  return tokenData;
}

async function updateDeviceStatus(supabase: any, deviceToken: string, status: 'online' | 'offline', systemInfo: any) {
  try {
    // First check if device exists
    const { data: existingDevice, error: checkError } = await supabase
      .from('devices')
      .select('id, name')
      .eq('token', deviceToken)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking device:', checkError);
      throw checkError;
    }

    if (!existingDevice) {
      // If device doesn't exist, create it
      const { error: createError } = await supabase
        .from('devices')
        .insert({
          name: `Device ${deviceToken}`,
          token: deviceToken,
          category: 'player',
          status,
          system_info: systemInfo,
          last_seen: new Date().toISOString()
        });

      if (createError) {
        console.error('Error creating device:', createError);
        throw createError;
      }
    } else {
      // If device exists, update it
      const { error: updateError } = await supabase
        .from('devices')
        .update({
          status,
          system_info: systemInfo,
          last_seen: new Date().toISOString()
        })
        .eq('token', deviceToken);

      if (updateError) {
        console.error('Error updating device status:', updateError);
        throw updateError;
      }
    }
  } catch (error) {
    console.error('Error in updateDeviceStatus:', error);
    throw error;
  }
}

let statusUpdateInterval: NodeJS.Timeout;

async function initSupabase() {
  if (supabase) return supabase;

  try {
    const envVars = await (window as any).electronAPI.getEnvVars();
    
    if (!envVars.VITE_SUPABASE_URL || !envVars.VITE_SUPABASE_ANON_KEY) {
      throw new Error('Missing Supabase connection details. Please check your .env file.');
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
    console.log('MAC Address:', macAddress);
    
    if (!macAddress) {
      throw new Error('Could not get MAC address');
    }

    // Check for existing active token
    const { data: existingToken, error: tokenError } = await supabase
      .from('device_tokens')
      .select('token')
      .eq('mac_address', macAddress)
      .eq('status', 'active')
      .maybeSingle();

    if (tokenError) {
      console.error('Error checking existing token:', tokenError);
      throw tokenError;
    }

    let deviceToken;
    if (existingToken) {
      console.log('Found existing token:', existingToken);
      deviceToken = existingToken.token;
    } else {
      // Create new token
      const tokenData = await createDeviceToken(macAddress);
      console.log('Created new token:', tokenData);
      deviceToken = tokenData.token;
    }

    // Start status updates
    const startStatusUpdates = async () => {
      try {
        const systemInfo = await (window as any).electronAPI.getSystemInfo();
        console.log('Updating device status with token:', deviceToken);
        await updateDeviceStatus(supabase, deviceToken, 'online', systemInfo);

        if (statusUpdateInterval) {
          clearInterval(statusUpdateInterval);
        }

        statusUpdateInterval = setInterval(async () => {
          try {
            const updatedSystemInfo = await (window as any).electronAPI.getSystemInfo();
            await updateDeviceStatus(supabase, deviceToken, 'online', updatedSystemInfo);
          } catch (error) {
            console.error('Error in status update interval:', error);
          }
        }, 15000);
      } catch (error) {
        console.error('Error starting status updates:', error);
      }
    };

    await startStatusUpdates();

    // Set offline status when app closes
    window.addEventListener('beforeunload', async (event) => {
      event.preventDefault();
      if (statusUpdateInterval) {
        clearInterval(statusUpdateInterval);
      }
      const systemInfo = await (window as any).electronAPI.getSystemInfo();
      await updateDeviceStatus(supabase, deviceToken, 'offline', systemInfo);
    });
    
    return supabase;
  } catch (error) {
    console.error('Supabase initialization error:', error);
    throw error;
  }
}

let supabase: ReturnType<typeof createClient>;

export { initSupabase, createDeviceToken };