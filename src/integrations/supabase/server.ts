
// This file is for backend use only (Netlify functions)
import { createClient } from '@supabase/supabase-js';
// Use any for Database type since we can't modify the types.ts file
type Database = any;

// This file should only be imported in server-side contexts (e.g., Netlify functions)
export const createServerSupabaseClient = (
  supabaseUrl: string,
  supabaseServiceKey: string
) => {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase URL or Service Key");
  }
  
  return createClient<Database>(supabaseUrl, supabaseServiceKey);
};
