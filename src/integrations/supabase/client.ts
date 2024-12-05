import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    VITE_SUPABASE_URL: supabaseUrl,
    VITE_SUPABASE_ANON_KEY: supabaseAnonKey
  });
}

export const supabase = createClient<Database>(supabaseUrl!, supabaseAnonKey!, {
  auth: {
    persistSession: true,
    detectSessionInUrl: false,
    autoRefreshToken: false,
    flowType: 'implicit'
  },
  realtime: {
    params: {
      eventsPerSecond: 2
    }
  }
});