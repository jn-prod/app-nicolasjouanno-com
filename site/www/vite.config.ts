import { defineConfig } from 'vite'
import { resolve } from 'path'
import preact from '@preact/preset-vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        videoTrainer: resolve(__dirname, 'pages/video-trainer/index.html'),
        jflbLive: resolve(__dirname, 'pages/jflb-live/index.html'),
        feezify: resolve(__dirname, 'pages/feezify/index.html'),
      },
    },
  },
})
