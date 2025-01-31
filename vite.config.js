import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.ttf'],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    }
  },
  define: {
    'process.env.VITE_AUTH0_CALLBACK_URL': JSON.stringify('https://aquamarine-shortbread-a36146.netlify.app/callback')
  }
});