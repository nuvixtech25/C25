/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  // Adicione aqui outras variáveis de ambiente necessárias, sempre com o prefixo VITE_
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
