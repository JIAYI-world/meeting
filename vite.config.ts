import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

declare const process: { env: { BASE_PATH?: string } }

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.BASE_PATH || '/',
})
