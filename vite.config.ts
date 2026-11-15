import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // A biblioteca de mapas carrega um arquivo auxiliar (worker) pelo próprio endereço:
  // sem o pré-empacotamento do Vite, esse endereço continua certo no desenvolvimento.
  optimizeDeps: {
    exclude: ['maplibre-gl'],
  },
})