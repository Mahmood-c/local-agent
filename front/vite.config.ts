import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build:{
    outDir:"../dist/view",
    emptyOutDir:true,
    rollupOptions:{
       output: {
        entryFileNames: `assets/app.js`,          // rename main entry bundle
        chunkFileNames: `assets/chunk-[name].js`, // dynamic imports
        assetFileNames: `assets/[name].[ext]`     // .css, images, fonts...
      }
    }
  },
  
})
