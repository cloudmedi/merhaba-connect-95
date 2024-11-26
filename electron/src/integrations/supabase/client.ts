import { createClient } from '@supabase/supabase-js';

// Separate token management functions
async function createDeviceToken() {
  const supabase = await initSupabase();
  const token = Math.random().toString(36).substring(2, 8).toUpperCase();
  const expirationDate = new Date();
  expirationDate.setFullYear(expirationDate.getFullYear() + 1);

  const { data: tokenData, error: tokenError } = await supabase
    .from('device_tokens')
    .insert({
      token,
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

async function linkDeviceToToken(deviceId: string, token: string) {
  const supabase = await initSupabase();
  const { error: updateError } = await supabase
    .from('device_tokens')
    .update({ device_id: deviceId })
    .eq('token', token)
    .eq('status', 'active');

  if (updateError) {
    console.error('Error linking device to token:', updateError);
    throw updateError;
  }
}

async function initSupabase() {
  if (supabase) return supabase;

  try {
    const envVars = await (window as any).electronAPI.getEnvVars();
    console.log('Environment variables received:', envVars);
    
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
        }
      }
    );
    
    const deviceId = await (window as any).electronAPI.getDeviceId();
    console.log('Device ID:', deviceId);
    
    // Get user's profile and company_id
    const { data: userProfile, error: profileError } = await supabase
      .from('profiles')
      .select('company_id')
      .maybeSingle();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      throw profileError;
    }

    if (!userProfile?.company_id) {
      throw new Error('No company associated with user profile');
    }

    // Get or create a default branch for the company
    const { data: branches, error: branchError } = await supabase
      .from('branches')
      .select('id')
      .eq('company_id', userProfile.company_id)
      .order('created_at', { ascending: true })
      .limit(1);

    let branchId: string;

    if (branchError || !branches?.length) {
      // Create a default branch if none exists
      const { data: newBranch, error: createBranchError } = await supabase
        .from('branches')
        .insert({
          name: 'Default Branch',
          company_id: userProfile.company_id
        })
        .select()
        .maybeSingle();

      if (createBranchError || !newBranch) {
        console.error('Error creating default branch:', createBranchError);
        throw createBranchError || new Error('Failed to create default branch');
      }

      branchId = newBranch.id;
      console.log('Created default branch:', branchId);
    } else {
      branchId = branches[0].id;
      console.log('Using existing branch:', branchId);
    }

    // Check for existing device
    const { data: existingDevice, error: deviceError } = await supabase
      .from('devices')
      .select('id')
      .eq('id', deviceId)
      .maybeSingle();

    if (deviceError) {
      console.error('Error checking device:', deviceError);
      throw deviceError;
    }

    if (!existingDevice) {
      const { error: insertDeviceError } = await supabase
        .from('devices')
        .insert({
          id: deviceId,
          name: 'Electron App',
          category: 'player',
          status: 'online',
          branch_id: branchId,
          system_info: {},
          schedule: {}
        });

      if (insertDeviceError) {
        console.error('Error creating device:', insertDeviceError);
        throw insertDeviceError;
      }
    }
    
    // Check for existing active token
    const { data: existingToken, error: tokenError } = await supabase
      .from('device_tokens')
      .select('*')
      .eq('device_id', deviceId)
      .eq('status', 'active')
      .maybeSingle();

    if (tokenError) {
      console.error('Error checking device token:', tokenError);
      throw tokenError;
    }

    // If no token exists or is not linked to this device, create a new one
    if (!existingToken) {
      const tokenData = await createDeviceToken();
      await linkDeviceToToken(deviceId, tokenData.token);
    }
    
    console.log('Supabase initialized successfully');
    return supabase;
  } catch (error) {
    console.error('Supabase initialization error:', error);
    throw error;
  }
}

let supabase: ReturnType<typeof createClient>;

export { initSupabase, createDeviceToken, linkDeviceToToken };