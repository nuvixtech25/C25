
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Verify environment variables are loaded
if (process.env.NODE_ENV === 'development') {
  console.log('Running in development mode');
  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    console.warn('Missing Supabase environment variables. Please check your .env file');
  }
}

createRoot(document.getElementById("root")!).render(
  <App />
);
