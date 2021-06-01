<script lang='ts'>
  import { slide } from 'svelte/transition'
  import { onMount } from 'svelte'
  import { boolSaveToLocal, boolWeekendMode, weekdaysStore } from '../lib/store'
  import { weekdays, weekend } from '../lib/constant'


  let boolMenu = false
  function toggleMenu() {
    boolMenu = !boolMenu
  }

  function handleKeydown(event: KeyboardEvent) {
    let key = event.key
    if (key == 'Escape') {
      boolMenu = false
    }
  }

  function switchWeekendMode() {
    $boolWeekendMode = !$boolWeekendMode
    localStorage.setItem('weekendMode', String($boolWeekendMode))
    setWeekendMode()
  }

  function setWeekendMode() {
    if ($boolWeekendMode) {
      $weekdaysStore = [...$weekdaysStore, ...weekend]
    } else {
      $weekdaysStore = weekdays
    }
  }

  function switchLocalMode() {
    $boolSaveToLocal = !$boolSaveToLocal
  }
</script>

<svelte:window on:keydown={handleKeydown} />
<div class="relative">
  <button class="settings-button" on:click={toggleMenu}>
    <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3886" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><defs><style type="text/css"></style></defs><path d="M852.11 620A108 108 0 1 1 960 512a107.94 107.94 0 0 1-107.89 108zM512 620a108 108 0 1 1 107.89-108A107.95 107.95 0 0 1 512 620zM171.89 620a108 108 0 1 1 107.88-108 107.94 107.94 0 0 1-107.88 108z" fill="#2c2c2c" p-id="3887"></path></svg>
  </button>
  {#if boolMenu}
  <div transition:slide class="settings-menu">
    <ul>
      <li class="hover:bg-gray-200">
        <div on:click={switchWeekendMode} class="checkbox {$boolWeekendMode? 'checked' : ''}">
          周末模式
        </div>
      </li>
      <li class="hover:bg-gray-200">
        <div on:click={switchLocalMode} class="checkbox {$boolSaveToLocal? 'checked' : ''}">
          保存至本地
        </div>
      </li>
    </ul>
  </div>
  {/if}
</div>

<style>
  ul {
    @apply list-none m-0 p-0;
  }
  li {
    @apply cursor-pointer;
  }
  .settings-button {
    @apply bg-white cursor-pointer;
    @apply w-10 h-10 flex items-center justify-center;
    @apply p-2 text-base border-0 relative rounded-full;
    @apply transition;
  }
  .settings-button:hover {
    @apply bg-gray-300;
  }
  .settings-menu {
    @apply absolute min-w-50 right-0 top-[120%] bg-white py-2 shadow-md rounded-md;
  }
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