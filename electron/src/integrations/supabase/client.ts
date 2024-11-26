import { createClient } from '@supabase/supabase-js';

// Token yönetimi için ayrı fonksiyonlar
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

async function getOrCreateDefaultBranch() {
  const supabase = await initSupabase();
  
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

  if (branchError) {
    console.error('Error fetching branches:', branchError);
    throw branchError;
  }

  if (branches && branches.length > 0) {
    return branches[0].id;
  }

  // Create a default branch if none exists
  const { data: newBranch, error: createBranchError } = await supabase
    .from('branches')
    .insert({
      name: 'Default Branch',
      company_id: userProfile.company_id
    })
    .select()
    .single();

  if (createBranchError || !newBranch) {
    console.error('Error creating default branch:', createBranchError);
    throw createBranchError || new Error('Failed to create default branch');
  }

  return newBranch.id;
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
      // Get or create default branch
      const branchId = await getOrCreateDefaultBranch();
      
      // Önce token oluştur
      const tokenData = await createDeviceToken();
      console.log('Created new token:', tokenData);
      
      // Sonra cihazı ekle
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

      // Son olarak token'ı cihaza bağla
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