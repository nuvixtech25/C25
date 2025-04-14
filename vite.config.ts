
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { mockApiPlugin } from "./src/mocks/mockPlugin";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "./", // Add explicit base path for assets
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    // Ensure proper output directory
    outDir: "dist",
    // Generate manifest for better asset tracking
    manifest: true,
    // Ensure chunks are properly named
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
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
}));
