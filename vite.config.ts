
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "localhost",
    port: 8080,
    strictPort: true,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    copyPublicDir: true,
    rollupOptions: {
      external: [],
      output: {
        manualChunks: {
          'vendor': [
            '@supabase/supabase-js',
            '@supabase/auth-ui-react'
          ]
        }
      }
    }
  },
  optimizeDeps: {
    include: ['@supabase/supabase-js', '@supabase/auth-ui-react']
  },
  define: {
    'process.env.SANITY_API_TOKEN': JSON.stringify(process.env.SANITY_API_TOKEN),
  },
}))
