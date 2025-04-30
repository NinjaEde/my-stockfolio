import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  optimizeDeps: {
    // entferne das Exclude oder benutze Include, damit lucide-react vorab gebundlet wird
    // exclude: ['lucide-react'],  
    include: ['lucide-react'],
  },
});
