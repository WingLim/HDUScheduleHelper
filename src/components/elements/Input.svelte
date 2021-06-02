<script lang='ts'>
  import { createEventDispatcher } from 'svelte'
  export let placeholder = ''
  export let value = ''

  const dispatch = createEventDispatcher()

  function handleInput() {
    dispatch('input', value)
  }
</script>

<input type='text' {placeholder} bind:value={value} on:input={handleInput}>

<style>
  input {
    @apply p-2 rounded-md border-2 outline-none border-solid text-base flex-grow;
    border-color: rgba(209, 213, 219);
  }
  input:hover {
    @apply border-gray-400;
  }
  input:focus {
    @apply border-blue-600;
  }
</style>