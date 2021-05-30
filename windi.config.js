import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  extract: {
    include: ['./src/**/*.{svelte}', './index.html'],
    exclude: ['node_modules', '.git']
  }
})