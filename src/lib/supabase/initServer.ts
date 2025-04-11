
/**
 * Backend Supabase client initialization with Service Role Key
 * IMPORTANT: This client should NEVER be used in browser/client code
 * Only use in secure server environments (Netlify functions, etc.)
 */
import { createClient } from '@supabase/supabase-js';

// Use environment variables with fallbacks
// In production, these should be properly set in the environment
const supabaseUrl = process.env.SUPABASE_URL || "https://onysoawoiffinwewtsex.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// Type for Database is kept as 'any' to match existing implementation
type Database = any;

// Create and export the admin client with service role
export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false, // No need to persist session for server operations
    autoRefreshToken: false,
  }
});

// We don't log the service URL in production for security reasons
if (process.env.NODE_ENV === 'development') {
  console.log(`Supabase admin client initialized with URL: ${supabaseUrl.substring(0, 20)}...`);
}
