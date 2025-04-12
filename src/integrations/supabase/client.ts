
import { createClient } from '@supabase/supabase-js'

// Default values for local development if env vars are missing
const defaultSupabaseUrl = 'https://onysoawoiffinwewtsex.supabase.co'
const defaultSupabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ueXNvYXdvaWZmaW53ZXd0c2V4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMzQzOTQsImV4cCI6MjA1OTgxMDM5NH0.E1Gqo0_Uwg4rZJOPvrNk-eIKMOZ5vRUYVsQX2la22MQ'

// Try to get values from environment variables, fall back to defaults if not available
const supabaseUrl = process.env.VITE_SUPABASE_URL || import.meta.env?.VITE_SUPABASE_URL || defaultSupabaseUrl
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || import.meta.env?.VITE_SUPABASE_ANON_KEY || defaultSupabaseKey

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey)
