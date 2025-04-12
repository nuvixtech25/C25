
// src/lib/supabase/initClient.ts
import { createClient } from '@supabase/supabase-js';

// Safe environment variable access
const getSupabaseConfig = () => {
  const supabaseUrl = typeof import.meta !== 'undefined' && 
    import.meta.env ? import.meta.env.VITE_SUPABASE_URL : undefined;
    
  const supabaseKey = typeof import.meta !== 'undefined' && 
    import.meta.env ? import.meta.env.VITE_SUPABASE_ANON_KEY : undefined;

  // Validate URL and Key
  if (!supabaseUrl || !supabaseKey) {
    // Log error but don't crash the app
    console.error(`
      [CONFIGURATION ERROR] Supabase credentials not found.
      Please set the following environment variables:
      - VITE_SUPABASE_URL
      - VITE_SUPABASE_ANON_KEY
    `);
    
    // Return fallback empty values that will fail gracefully
    return {
      url: '',
      key: ''
    };
  }

  return {
    url: supabaseUrl,
    key: supabaseKey
  };
};

// Initialize the client with safe values
const { url, key } = getSupabaseConfig();
export const supabase = createClient(url, key);
