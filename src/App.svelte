<script lang="ts">
  import Schedule from './components/Schedule.svelte'
  import Toast from './components/elements/Toast.svelte'
  import { hint } from './lib/utils'
</script>

<main>
  <Schedule />
  <Toast />
</main>

<style>
  :root {
    font-family: -apple-system, 'Source Sans Pro',  BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
    overflow-x: hidden;
  }
</style>
