
import { createClient } from '@supabase/supabase-js';

// Default to empty strings so we can handle the error gracefully
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL and Anon Key are missing. Make sure you have set up your environment variables correctly.');
  // We'll still create the client but it won't work properly
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
