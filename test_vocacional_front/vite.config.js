import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // 👈 Esto es clave para ngrok (y acceso externo en general)
    port: 5173,        // Puerto donde corre Vite
  }
})
