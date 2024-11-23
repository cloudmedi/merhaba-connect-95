import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Ensure environment variables are defined
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Create a single instance of the Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: localStorage,
    storageKey: 'supabase.auth.token',
    flowType: 'pkce',
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
});

// Prevent creating multiple instances
Object.freeze(supabase);

// Export a function to get the client instance
export const getSupabaseClient = () => supabase;