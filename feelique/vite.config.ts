import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },

  // ✅ Vitest config
  test: {
    environment: 'jsdom',
    globals: true
  },

  // ✅ sorgt dafür, dass in deinen Tests baseUrl NICHT undefined ist
  define: {
    'import.meta.env.VITE_BACKEND_BASE_URL': JSON.stringify('http://localhost:8080')
  }
})
