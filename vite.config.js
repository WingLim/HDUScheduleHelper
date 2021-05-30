import { defineConfig } from 'vite'
import svelte from '@sveltejs/vite-plugin-svelte'
import { windi } from 'svelte-windicss-preprocess';

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env': process.env
  },
  plugins: [
    svelte({
      preprocess: [
        windi({})
      ]
    }),
  ]
})
