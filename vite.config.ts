import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

type Mode = 'development' | 'staging' | 'production';

interface EnvConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
}

const envConfigs: Record<Mode, EnvConfig> = {
  development: {
    supabaseUrl: 'https://crllgygjuqpluvdpwayi.supabase.co',
    supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNybGxneWdqdXFwbHV2ZHB3YXlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDI2NjQzNzAsImV4cCI6MjAxODI0MDM3MH0.qgkN_0vO8cupvAYkl7J-0I4UuPj0xfXbwKD0Ue1Rx-c'
  },
  staging: {
    supabaseUrl: 'https://crllgygjuqpluvdpwayi.supabase.co',
    supabaseAnonKey: process.env.VITE_SUPABASE_ANON_KEY_STAGING || ''
  },
  production: {
    supabaseUrl: 'https://crllgygjuqpluvdpwayi.supabase.co',
    supabaseAnonKey: process.env.VITE_SUPABASE_ANON_KEY_PRODUCTION || ''
  }
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const environment = mode as Mode;
  const config = envConfigs[environment];

  if (!config) {
    throw new Error(`Invalid mode: ${mode}`);
  }

  return {
    define: {
      __SUPABASE_URL__: JSON.stringify(config.supabaseUrl),
      __SUPABASE_ANON_KEY__: JSON.stringify(config.supabaseAnonKey)
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