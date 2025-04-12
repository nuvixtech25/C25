
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

// Make sure environment variables are loaded before rendering
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Supabase environment variables not found, using default values')
}

createRoot(document.getElementById("root")!).render(
  <App />
);
