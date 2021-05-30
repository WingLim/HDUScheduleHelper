<script lang="ts">
  import Schedule from './components/Schedule.svelte'
  

  const toastOptions = {
    theme: {
      '--toastContainerTop': 'auto',
      '--toastContainerRight': 'auto',
      '--toastContainerBottom': '8rem',
      '--toastContainerLeft': 'calc(50vw - 8rem)',
    }
  }
</script>

<main>
  <Schedule />
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
