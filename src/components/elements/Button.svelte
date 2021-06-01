<script>
  import { createEventDispatcher } from 'svelte'
  export let type = ''
  export let className = ''

  const dispatch = createEventDispatcher()

  function handleClick() {
    dispatch('click')
  }
</script>

<button on:click={handleClick} class="{type} {className}">
  <slot />
</button>

<style>
  button {
    @apply inline-flex justify-center items-center;
    @apply text-black border-0 rounded-md p-2 text-base shadow-md cursor-pointer;
  }
  button:hover {
    @apply shadow-lg;
  }
  .primary {
    @apply bg-blue-600 text-white;
  }
</style>