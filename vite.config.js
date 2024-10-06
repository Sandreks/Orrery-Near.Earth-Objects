import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true // Habilita source maps en el build
  },
  css: {
    postcss: './postcss.config.js', // Asegúrate de que esté correctamente configurado
  },
})
