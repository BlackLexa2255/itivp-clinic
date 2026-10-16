import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  // Карты исходного кода: Sentry по ним показывает строку исходника, а не минифицированного файла
  build: { sourcemap: true },
})
