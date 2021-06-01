<script lang='ts'>
  import { createEventDispatcher } from 'svelte'
  export let type = ''
  export let loading = false
  export let className = ''
  export let content = ''

  const dispatch = createEventDispatcher()

  function handleClick() {
    dispatch('click')
  }
</script>

<button on:click={handleClick} class="{type} {className}">
  <slot />
  {#if loading}
  <svg class="icon mr-1 animate-spin" aria-hidden="true" viewBox="0 0 16 16"><title>Loading</title><g stroke-width="1" fill="currentColor" stroke="currentColor"><path d="M.5,8a7.5,7.5,0,1,1,1.91,5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path></g></svg>
  {/if}
  {content}
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