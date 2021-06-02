const { defineConfig } = require('windicss/helpers')

module.exports =  defineConfig({
  extract: {
    include: ['./src/**/*.{svelte}', './index.html'],
    exclude: ['node_modules', '.git']
  },
  theme: {
    screens: {
      xs: '420px',
      sm: '640px'
    },
    extend: {
      transitionProperty: {
        width: 'width'
      }
    }
  }
})