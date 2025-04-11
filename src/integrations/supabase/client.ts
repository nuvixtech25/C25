
// This file is for frontend use only
import { createClient } from '@supabase/supabase-js';
// Use any for Database type since we can't modify the types.ts file
type Database = any;

const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL || '';
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || '';

// Validate the required environment variables
if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  console.warn('Missing Supabase environment variables. Please check your .env file and ensure PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY are set.');
}

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
