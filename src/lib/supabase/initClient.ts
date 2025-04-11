
import { createClient } from '@supabase/supabase-js';

// Use Vite environment variables for client-side code
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Show warning if environment variables are missing
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Check your .env file.');
}

type Database = any;

export const supabase = createClient<Database>(
  supabaseUrl || '', 
  supabaseAnonKey || '', 
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);

// Only log partial URL in development for security
if (process.env.NODE_ENV !== 'production') {
  console.log(`Supabase client initialized with URL: ${supabaseUrl?.substring(0, 10)}...`);
}
