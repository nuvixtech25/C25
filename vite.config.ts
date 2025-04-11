
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { mockApiPlugin } from "./src/mocks/mockPlugin";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && mockApiPlugin(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    // Use existing values from .env file or fallback to values in the code
    'import.meta.env.PUBLIC_SUPABASE_URL': JSON.stringify(process.env.PUBLIC_SUPABASE_URL || 'https://onysoawoiffinwewtsex.supabase.co'),
    'import.meta.env.PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(process.env.PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ueXNvYXdvaWZmaW53ZXd0c2V4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMzQzOTQsImV4cCI6MjA1OTgxMDM5NH0.E1Gqo0_Uwg4rZJOPvrNk-eIKMOZ5vRUYVsQX2la22MQ')
  }
}));
