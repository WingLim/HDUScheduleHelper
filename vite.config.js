import { defineConfig } from 'vite'
import svelte from '@sveltejs/vite-plugin-svelte'
import autopreprocess from "svelte-preprocess";
import { windi } from 'svelte-windicss-preprocess';

const preprocess = autopreprocess({})

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env': process.env
  },
  plugins: [
    svelte({
      preprocess: [
        preprocess,
        windi({}),
      ]
    }),
  ]
})
