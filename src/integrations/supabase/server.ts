
// This file is for backend use only (Netlify functions)
import { createClient } from '@supabase/supabase-js';
// Use any for Database type since we can't modify the types.ts file
type Database = any;

// This file should only be imported in server-side contexts (e.g., Netlify functions)
export const createServerSupabaseClient = (
  supabaseUrl: string | undefined,
  supabaseServiceKey: string | undefined
) => {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase URL or Service Key. Please configure them in your Netlify environment variables.");
  }
  
  return createClient<Database>(supabaseUrl, supabaseServiceKey);
};

// Add a helper function to check if environment variables are set
export const checkSupabaseEnvVars = () => {
  const missingVars = [];
  
  if (!process.env.SUPABASE_URL) missingVars.push('SUPABASE_URL');
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) missingVars.push('SUPABASE_SERVICE_ROLE_KEY');
  
  return {
    isConfigured: missingVars.length === 0,
    missingVars
  };
};
