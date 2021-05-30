<script>
  import Select from 'svelte-select'
  import Button from '../elements/Button.svelte'
  import { slide } from 'svelte/transition'
  import { searchResult, boolMoreButton } from '../../lib/store'
  import { apiUrl } from '../../config'
  import { propertyItems,weekdayItems  } from '../../lib/constant'

  export let page

  let title
  let boolAdvance = true
  let paramsMap = new Map()
  const groupBy = (item) => item.group

  // 重新赋值 paramsMap, 触发 svelte 更新
  function updateParamsMap() {
    paramsMap = paramsMap
  }

  function handlePropertySelect(event) {
    paramsMap.set('property', event.detail.value)
    updateParamsMap()
  }
  function handlePropertyClear(event) {
    paramsMap.delete('property')
    updateParamsMap()
  }

  function handleWeekdaySelect(event) {
    paramsMap.set('weekday', event.detail.value)
    updateParamsMap()
  }
  function handleWeekdayClear(event) {
    paramsMap.delete('weekday')
    updateParamsMap()
  }

  function buildRequestUrl() {
    let params = ''
    if (title) {
      params += '&title=' + title
    }
    if (paramsMap.has('property')) {
      params += '&property=' + paramsMap.get('property')
    }
    if (paramsMap.has('weekday')) {
      params += '&weekday=' + paramsMap.get('weekday')
    }
    if (page) {
      params += '&page=' + page 
    }
    return apiUrl + params
  }
  
  async function searchCourse() {
    page = 0
    await fetch(buildRequestUrl())
    .then(function(resp) {
      return resp.json()
    })
    .then(function(json) {
      $searchResult = json
    })
    .catch(function(err) {
      console.log(err)
    })
  }

  async function loadMore() {
    await fetch(buildRequestUrl())
    .then(function(resp) {
      return resp.json()
    })
    .then(function(json) {
      if (json.length == 0) {
        $boolMoreButton = false
      }
      $searchResult = [...$searchResult, ...json]
    })
    .catch(function(err) {
      console.log(err)
    })
  }

  $: if (paramsMap) {
    searchCourse()
  }
  $: if (page) {
    loadMore()
  }
</script>

<form on:submit|preventDefault={searchCourse} >
  <div class="flex gap-1 flex-row mb-4">
    <input class="searchInput" type="text" placeholder="课程名" bind:value={title} on:input={searchCourse}>
    <Button type="primary">搜索</Button>
    <Button type="{boolAdvance ? 'primary' : ''}" clickFn="{() => {boolAdvance = !boolAdvance}}">
      高级搜索
    </Button>
  </div>
  
  {#if boolAdvance}
  <div transition:slide>
    <div class="themed flex flex-row">
      <div class="flex items-start flex-col">
        <label for="">课程性质</label>
        <Select items={propertyItems} selectedValue='学科必修' {groupBy} on:select={handlePropertySelect} on:clear={handlePropertyClear} />
      </div>
      <div class="flex items-start flex-col ml-4">
        <label for="">日期</label>
        <Select items={weekdayItems} selectedValue='周一' on:select={handleWeekdaySelect} on:clear={handleWeekdayClear} />
      </div>
    </div>
  </div>
  {/if}
</form>

<style>
  .searchInput {
    @apply p-2 rounded-md border-2 outline-none border-solid text-base flex-grow-[1];
    border-color: rgba(209, 213, 219);
  }
  .searchInput:hover {
    @apply border-gray-400;
  }
  .searchInput:focus {
    @apply border-blue-600;
  }
  .active {
    @apply bg-blue-600 text-white;
  }
  .themed {
    @apply text-left;
    --border: 2px solid rgba(209, 213, 219);
    --borderRadius: 0.375rem;
    --itemIsActiveBG: rgba(37, 99, 235);
    --itemHoverBG: rgba(229, 231, 235);
  }
</style>