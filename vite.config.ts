// vite.config.ts
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Carrega envs do .env e do ambiente Lovable
  const env = loadEnv(mode, process.cwd(), ['VITE_', 'SUPABASE_']);

  return {
    plugins: [react()],
    define: {
      'process.env': JSON.stringify(env),
      'import.meta.env': JSON.stringify(env)
    },
    server: {
      watch: {
        usePolling: true // Necessário para alguns ambientes Lovable
      }
    }
  };
});