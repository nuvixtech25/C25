
import { createClient } from '@supabase/supabase-js';

// Definições seguras para as variáveis de ambiente
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://onysoawoiffinwewtsex.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ueXNvYXdvaWZmaW53ZXd0c2V4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMzQzOTQsImV4cCI6MjA1OTgxMDM5NH0.E1Gqo0_Uwg4rZJOPvrNk-eIKMOZ5vRUYVsQX2la22MQ';

// Show warning if environment variables are missing
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Missing Supabase environment variables. Using hardcoded values.');
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

// Only log partial URL in development for security
if (process.env.NODE_ENV !== 'production') {
  console.log(`Supabase client initialized with URL: ${supabaseUrl.substring(0, 10)}...`);
}
