import { createClient } from '@supabase/supabase-js';

let supabase: ReturnType<typeof createClient>;

async function initSupabase() {
  if (supabase) return supabase;

  try {
    const envVars = await (window as any).electronAPI.getEnvVars();
    
    if (!envVars.VITE_SUPABASE_URL || !envVars.VITE_SUPABASE_ANON_KEY) {
      console.error('Missing Supabase environment variables:', envVars);
      throw new Error('Supabase bağlantı bilgileri eksik');
    }

    supabase = createClient(envVars.VITE_SUPABASE_URL, envVars.VITE_SUPABASE_ANON_KEY);
    
    // Test connection
    const { data, error } = await supabase.from('device_tokens').select('*').limit(1);
    if (error) throw error;
    
    return supabase;
  } catch (error) {
    console.error('Supabase initialization error:', error);
    throw error;
  }
}

export { initSupabase };