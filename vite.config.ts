import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/simulateur-solaire-V4/', // IMPORTANT pour GitHub Pages
  server: {
    proxy: {
      '/pvgis-api': {
        target: 'https://re.jrc.ec.europa.eu/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/pvgis-api/, ''),
        secure: false,
      }
    }
  }
})

