import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/simulateur-solaire-V4/', // IMPORTANT pour GitHub Pages
})
