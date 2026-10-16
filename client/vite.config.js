import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  // Сайт на GitHub Pages открывается по адресу /itivp-clinic/
  base: '/itivp-clinic/',
  // Карты исходного кода: Sentry по ним показывает строку исходника, а не минифицированного файла
  build: { sourcemap: true },
})
