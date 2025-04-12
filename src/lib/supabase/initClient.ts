// src/lib/supabase/initClient.ts
import { createClient } from '@supabase/supabase-js';

// Solução robusta para ambientes Lovable
const getSupabaseConfig = () => {
  // Modo desenvolvimento (Vite)
  if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
    return {
      url: import.meta.env.VITE_SUPABASE_URL,
      key: import.meta.env.VITE_SUPABASE_ANON_KEY
    };
  }

  // Modo produção (Lovable/Netlify)
  if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    return {
      url: process.env.SUPABASE_URL,
      key: process.env.SUPABASE_ANON_KEY
    };
  }

  throw new Error(`
    [ERRO DE CONFIGURAÇÃO] Credenciais do Supabase não encontradas.
    Configure em:
    1. Variáveis de ambiente (VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY)
    2. Painel Lovable/Netlify para produção
  `);
};

export const supabase = createClient(
  getSupabaseConfig().url,
  getSupabaseConfig().key
);