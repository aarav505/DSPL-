
import { createClient } from '@supabase/supabase-js';

// Default to empty strings so we can handle the error gracefully
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a mock supabase client when credentials are missing
let supabase: ReturnType<typeof createClient>;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL and Anon Key are missing. Make sure you have set up your environment variables correctly.');
  
  // Create a mock client that doesn't throw errors but logs them
  const mockFn = (...args: any[]) => {
    console.warn('Supabase operation attempted without proper setup:', args);
    return Promise.resolve({ data: null, error: new Error('Supabase not configured') });
  };
  
  // @ts-ignore - Creating a mock client
  supabase = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signUp: mockFn,
      signInWithPassword: mockFn,
      signOut: mockFn
    },
    from: () => ({
      insert: mockFn,
      select: mockFn,
      update: mockFn,
      delete: mockFn
    })
  };
} else {
  // Create the real client when credentials are available
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };
