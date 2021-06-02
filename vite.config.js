import { defineConfig } from 'vite'
import svelte from '@sveltejs/vite-plugin-svelte'
import { preprocess } from './svelte.config'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env': process.env
  },
  plugins: [
    svelte({
      preprocess: preprocess
    }),
  ]
})
