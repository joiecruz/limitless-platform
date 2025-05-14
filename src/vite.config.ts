
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on mode
  const env = loadEnv(mode, process.cwd())
  
  return {
    server: {
      host: "::",
      port: parseInt(env.VITE_PORT || '8080'),
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      outDir: env.VITE_APP_DOMAIN === 'app' ? 'dist-app' : 'dist',
      copyPublicDir: true,
    },
  }
})
