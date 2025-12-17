import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANTE: Ajuste o base conforme seu domínio:
  // - Para domínio customizado (ex: aquafloww.site): base: '/'
  // - Para GitHub Pages (ex: usuario.github.io/myroutine-): base: '/myroutine-/'
  base: '/myroutine-/', // Configurado para GitHub Pages
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})

