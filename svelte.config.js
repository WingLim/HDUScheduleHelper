const sveltePreprocess = require('svelte-preprocess')
const { windi } = require('svelte-windicss-preprocess')

module.exports = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [
    sveltePreprocess(),
    windi({
      configPath: './windi.config.js'
    }),
  ]
}
