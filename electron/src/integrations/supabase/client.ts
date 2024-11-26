import { createClient } from '@supabase/supabase-js';

let supabase: ReturnType<typeof createClient>;

async function initSupabase() {
  if (supabase) return supabase;

  const envVars = await (window as any).electronAPI.getEnvVars();
  
  if (!envVars.VITE_SUPABASE_URL || !envVars.VITE_SUPABASE_ANON_KEY) {
    console.error('Missing Supabase environment variables:', envVars);
    throw new Error('Missing Supabase environment variables');
  }

  supabase = createClient(envVars.VITE_SUPABASE_URL, envVars.VITE_SUPABASE_ANON_KEY);
  return supabase;
}

export { initSupabase };