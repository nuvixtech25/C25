
/**
 * Frontend Supabase client initialization
 * Uses the browser client and public/anonymous key
 * Safe to use in browser/client code
 */
import { createClient } from '@supabase/supabase-js';

// Use environment variables with fallbacks to prevent runtime errors
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || "https://onysoawoiffinwewtsex.supabase.co";
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || 
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ueXNvYXdvaWZmaW53ZXd0c2V4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMzQzOTQsImV4cCI6MjA1OTgxMDM5NH0.E1Gqo0_Uwg4rZJOPvrNk-eIKMOZ5vRUYVsQX2la22MQ";

// Type for Database is kept as 'any' to match existing implementation
type Database = any;

// Create and export the client instance
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Log URL during initialization (for debugging)
console.log(`Supabase client initialized with URL: ${supabaseUrl.substring(0, 20)}...`);
