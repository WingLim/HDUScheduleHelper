<script lang='ts'>
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()
  export let checked = false
  export let content: string
  
  function handleClick() {
    dispatch('click')
  }
</script>

<div on:click={handleClick} class="checkbox {checked? 'checked' : ''}">
  {content}
</div>

<style>
  .checkbox {
    @apply px-4 py-2 flex items-center;
  }
  .checkbox::before {
    @apply w-4 h-4 mr-1;
    @apply border-gray-300 border-2 border-solid rounded-md;
    @apply inline-block relative;
    @apply bg-white transition;
    content: '';
    background-position: center;
    background-repeat: no-repeat;
  }
  .checkbox:hover::before {
    @apply border-gray-400;
  }
  .checked:hover::before {
    @apply border-blue-600;
  }
  .checked::before {
    @apply border-blue-600 bg-blue-600;
    background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMicgaGVpZ2h0PScxMicgdmlld0JveD0nMCAwIDEyIDEyJz48cG9seWxpbmUgcG9pbnRzPScxIDYuNSA0IDkuNSAxMSAyLjUnIGZpbGw9J25vbmUnIHN0cm9rZT0nI0ZGRkZGRicgc3Ryb2tlLWxpbmVjYXA9J3JvdW5kJyBzdHJva2UtbGluZWpvaW49J3JvdW5kJyBzdHJva2Utd2lkdGg9JzInLz48L3N2Zz4=");
  }
</style>