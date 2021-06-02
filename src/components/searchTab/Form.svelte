<script lang='ts'>
  import Select from 'svelte-select'
  import Button from '../elements/Button.svelte'
  import Input from '../elements/Input.svelte'
  import { slide } from 'svelte/transition'
  import { searchResult, boolMoreButton } from '../../lib/store'
  import { apiUrl } from '../../config'
  import { propertyItems, weekdayItems, timeItems  } from '../../lib/constant'

  export let page: number

  let title: string
  let location: string
  let teacher: string
  let boolAdvance = false
  let paramsMap = new Map()
  const groupBy = (item: any) => item.group

  // 重新赋值 paramsMap, 触发 svelte 更新
  function updateParamsMap() {
    paramsMap = paramsMap
  }

  function handlePropertySelect(event: any) {
    paramsMap.set('property', event.detail.value)
    updateParamsMap()
  }
  function handlePropertyClear() {
    paramsMap.delete('property')
    updateParamsMap()
  }

  function handleWeekdaySelect(event: any) {
    paramsMap.set('weekday', event.detail.value)
    updateParamsMap()
  }
  function handleWeekdayClear() {
    paramsMap.delete('weekday')
    updateParamsMap()
  }

  function handleTimeSelect(event: any) {
    paramsMap.set('time', event.detail.value)
    updateParamsMap()
  }
  function handleTimeClear() {
    paramsMap.delete('time')
    updateParamsMap()
  }

  function buildRequestUrl() {
    let params = ''
    if (title) {
      params += '&title=' + title
    }
    if (location) {
      params += '&location=' + location
    }
    if (teacher) {
      params += '&teacher=' + teacher
    }
    if (paramsMap.has('property')) {
      params += '&property=' + paramsMap.get('property')
    }
    if (paramsMap.has('weekday')) {
      params += '&weekday=' + paramsMap.get('weekday')
    }
    if (paramsMap.has('time')) {
      params += '&time=' + paramsMap.get('time')
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
    <Input placeholder="课程名" bind:value={title} on:input={searchCourse} />
    <Button type="primary" content="搜索" />
    <Button type="{boolAdvance ? 'primary' : ''}" on:click="{() => {boolAdvance = !boolAdvance}}" content="高级搜索" />
  </div>
  
  {#if boolAdvance}
  <div transition:slide class="text-left">
    <div class="flex flex-row">
      <div class="themed flex flex-grow flex-col">
        <label for="">课程性质</label>
        <Select items={propertyItems} {groupBy} placeholder="下拉选择..." on:select={handlePropertySelect} on:clear={handlePropertyClear} />
      </div>
      <div class="themed flex flex-grow flex-col ml-4">
        <label for="">日期</label>
        <Select items={weekdayItems} placeholder="下拉选择..." on:select={handleWeekdaySelect} on:clear={handleWeekdayClear} />
      </div>
      <div class="themed flex flex-grow flex-col ml-4">
        <label for="">时间</label>
        <Select items={timeItems} {groupBy} placeholder="下拉选择..." on:select={handleTimeSelect} on:clear={handleTimeClear} />
      </div>
    </div>
    <div class="grid grid-cols-2 gap-2">
      <div class="flex flex-col flex-shrink-0">
        <label for="">上课地点</label>
        <Input placeholder="输入..." bind:value={location} on:input={searchCourse} />
      </div>
      <div class="flex flex-col flex-shrink-0">
        <label for="">教师</label>
        <Input placeholder="输入..." bind:value={teacher} on:input={searchCourse} />
      </div>
    </div>
  </div>
  {/if}
</form>

<style>
  .themed {
    --border: 2px solid rgba(209, 213, 219);
    --borderRadius: 0.375rem;
    --itemIsActiveBG: rgba(37, 99, 235);
    --itemHoverBG: rgba(229, 231, 235);
  }
</style>