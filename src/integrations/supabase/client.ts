
// This file is for frontend use only
import { createClient } from '@supabase/supabase-js';
// Use any for Database type since we can't modify the types.ts file
type Database = any;

// Get environment variables with fallbacks to ensure the app never crashes
const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL || 'https://onysoawoiffinwewtsex.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ueXNvYXdvaWZmaW53ZXd0c2V4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMzQzOTQsImV4cCI6MjA1OTgxMDM5NH0.E1Gqo0_Uwg4rZJOPvrNk-eIKMOZ5vRUYVsQX2la22MQ';

// Validate the environment variables
if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  console.warn('Missing Supabase environment variables. Please check your .env file and ensure PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY are set.');
}

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
