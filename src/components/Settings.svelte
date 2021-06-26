<script lang='ts'>
  import Checkbox from './elements/Checkbox.svelte'
  import { onMount } from 'svelte'
  import { slide } from 'svelte/transition'
  import { boolSaveToLocal, boolWeekendMode, weekdaysStore } from '../lib/store'
  import { weekdays, weekend } from '../lib/constant'

  let defaultSearch: boolean = true

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

  function switchSearchBar() {
    defaultSearch = localStorage.getItem('defaultSearch') == 'true'
    defaultSearch = !defaultSearch
    let value: string
    if (defaultSearch) {
      value = 'true'
    } else {
      value = 'false'
    }
    localStorage.setItem('defaultSearch', value)
  }
  onMount(() => {
    defaultSearch = localStorage.getItem('defaultSearch') == 'true'
  })
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
        <Checkbox on:click={switchWeekendMode} bind:checked={$boolWeekendMode} content="周末模式" />
      </li>
      <li class="hover:bg-gray-200">
        <Checkbox on:click={switchLocalMode} bind:checked={$boolSaveToLocal} content="保存至本地" />
      </li>
      <li class="hover:bg-gray-200">
        <Checkbox on:click={switchSearchBar} bind:checked={defaultSearch} content="默认开启搜索栏" />
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
</style>