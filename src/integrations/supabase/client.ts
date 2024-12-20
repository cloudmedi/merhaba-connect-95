import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true
  }
});

// Add removeChannel method to RealtimeChannel
declare module '@supabase/supabase-js' {
  interface RealtimeChannel {
    removeChannel(): void;
  }
}

// Add presenceState method
declare module '@supabase/supabase-js' {
  interface RealtimeChannel {
    presenceState(): Record<string, unknown>;
  }
}