
import { createClient } from '@supabase/supabase-js';

// Access environment variables safely
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Strict validation for required environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('ERROR: Required Supabase environment variables are missing.');
  throw new Error('Supabase configuration error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be defined in your environment.');
}

type Database = any;

export const supabase = createClient<Database>(
  supabaseUrl, 
  supabaseAnonKey, 
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);

// Log initialization without exposing credentials
if (process.env.NODE_ENV !== 'production') {
  console.log('Supabase client initialized successfully');
}
