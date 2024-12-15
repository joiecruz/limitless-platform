import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // In development, use the development project
  const isDev = mode === 'development';
  
  return {
    define: {
      // Development uses hardcoded values, production/staging use deployment platform env vars
      __SUPABASE_URL__: isDev 
        ? JSON.stringify('https://crllgygjuqpluvdpwayi.supabase.co')
        : 'window.__SUPABASE_URL__',
      __SUPABASE_ANON_KEY__: isDev
        ? JSON.stringify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNybGxneWdqdXFwbHV2ZHB3YXlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDI2NjQzNzAsImV4cCI6MjAxODI0MDM3MH0.qgkN_0vO8cupvAYkl7J-0I4UuPj0xfXbwKD0Ue1Rx-c')
        : 'window.__SUPABASE_URL__'
    },
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      mode === 'development' && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      sourcemap: mode !== 'production',
      minify: mode === 'production',
    },
  };
});