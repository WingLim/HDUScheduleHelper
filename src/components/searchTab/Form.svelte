<script>
  import Select from 'svelte-select'
  import { slide } from 'svelte/transition'
  import { searchResult } from '../../lib/store'
  import { apiUrl } from '../../config'

  let title

  const propertyItems = [
    {value: '学科必修', label: '学科必修', group: '必修课'},
    {value: '专业必修', label: '专业必修', group: '必修课'},
    {value: '通识必修', label: '通识必修', group: '必修课'},
    {value: '实践必修', label: '实践必修', group: '必修课'},
    {value: '课外必修', label: '课外必修', group: '必修课'},
    {value: '英语必修', label: '英语必修', group: '必修课'},
    {value: '科技发展与科技精神', label: '科技发展与科技精神', group: '公选课'},
    {value: '艺术创作与审美体验', label: '艺术创作与审美体验', group: '公选课'},
    {value: '社会发展与公民教育', label: '社会发展与公民教育', group: '公选课'},
    {value: '文明对话与国际视野', label: '文明对话与国际视野', group: '公选课'},
    {value: '人文经典与人文修养', label: '人文经典与人文修养', group: '公选课'},
    {value: '专业选修', label: '专业选修', group: '选修课'},
    {value: '通识选修', label: '通识选修', group: '选修课'},
  ]

  const weekdayItems = [
    {value: '周一', label: '周一'},
    {value: '周二', label: '周二'},
    {value: '周三', label: '周三'},
    {value: '周四', label: '周四'},
    {value: '周五', label: '周五'},
    {value: '周六', label: '周六'},
    {value: '周日', label: '周日'},
  ]

  const groupBy = (item) => item.group

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
    return apiUrl + params
  }
  
  async function searchCourse() {
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

  let boolAdvance = true
  function showAdvance() {
    boolAdvance = !boolAdvance
  }

  let paramsMap = new Map()

  $: if (paramsMap) {
    searchCourse()
  }
</script>

<form on:submit|preventDefault={searchCourse} >
  <div class="flex gap-1 flex-row mb-4">
    <input class="searchInput" type="text" placeholder="课程名" bind:value={title} on:input={searchCourse}>
    <button class="btn btn-primary" type="submit">搜索</button>
    <button class="btn {boolAdvance ? 'active' : ''}" on:click={showAdvance}>高级搜索</button>
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