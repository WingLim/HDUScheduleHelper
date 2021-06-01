<script lang='ts'>
  import { onMount } from 'svelte'
  import Course from './course/CourseItem.svelte'
  import SearchCourses from './searchTab/Search.svelte'
  import Button from './elements/Button.svelte'
  import Settings from './Settings.svelte'
  import GetSchedule from '../components/GetSchedule.svelte'
  import { courses, idMap, weekdaysStore, boolWeekendMode } from '../lib/store'
  import { times, weekend } from '../lib/constant'

  let boolSearch = true
  function toggleSearch() {
    boolSearch = !boolSearch
  }
  function hideSearch() {
    boolSearch = false
  }

  function readConfig() {
    $boolWeekendMode = localStorage.getItem('weekendMode') == 'true'
    if ($boolWeekendMode) {
      if ($weekdaysStore.length < 7) {
        $weekdaysStore = [...$weekdaysStore, ...weekend]
      }
    }

    let coursesStr = localStorage.getItem('courses')
    $courses = new Map(JSON.parse(coursesStr))
    
    let idMapStr = localStorage.getItem('idMap')
    $idMap = new Map(JSON.parse(idMapStr))
  }

  onMount(() => {
    readConfig()
  })
</script>

<div class="{boolSearch ? 'showSearchBarFlex': ''}" >
  <div class="main {boolSearch ? 'showSearchBarWidth': ''}">
  <div class="flex justify-between px-5 items-center">
    <h1 class="m-0">HDU 课程助手</h1>
    <div class="flex items-center gap-1">
      <GetSchedule />
      <Button on:click={toggleSearch} type="primary">
        <svg class="icon mr-1" viewBox="0 0 24 24">
          <g stroke-linecap="square" stroke-linejoin="miter" stroke-width="2" stroke="currentColor" fill="none" stroke-miterlimit="10">
              <line x1="22" y1="22" x2="15.656" y2="15.656"></line>
              <circle cx="10" cy="10" r="8"></circle>
          </g>
        </svg>
        搜索课程
      </Button>
      <Settings />
    </div>
  </div>
  <div class="schedule {$boolWeekendMode ? 'weekendMode' : 'weekdayMode'}">
    <div class="col-start-1 row-start-1 scheduleTableBorder"></div>
    {#each times as time, i}
    <div class="odd:bg-gray-100 p-y-1 col-start-1">
      <p class="m-0 text-xl">{i+1}</p>
      <p class="m-0 text-sm text-gray-400">{time.start}</p>
      <p class="m-0 text-sm text-gray-400">{time.end}</p>
    </div>
    {/each}
    
    {#each $weekdaysStore as weekday, i}
    <div class="row-start-1 col-start-{i + 2} flex items-center justify-center scheduleTableBorder">
      <p class="m-0 text-xl">{weekday}</p>
    </div>
    {/each}

    {#each [...$courses] as [key, options] (key) }
      <Course {options}/>
    {/each}
  </div>
  </div>
  <div class="searchBar {boolSearch ? 'searchBarWidth': ''}">
    <SearchCourses shown={boolSearch} on:click={hideSearch} />
  </div>
</div>

<style>
  .schedule {
    @apply grid w-full;
    grid-template-rows: repeat(12, minmax(3rem, 6rem));
  }
  .weekdayMode {
    @apply grid-cols-6;
  }
  .weekendMode {
    @apply grid-cols-8;
  }
  .scheduleTableBorder {
    @apply border-gray-300 border-0 border-b border-solid;
  }
  .searchBar {
    @apply w-0;
    @apply transition-all ease-linear duration-400;
  }
  .searchBarWidth {
    @apply w-[40%];
  }
  .main {
    @apply w-[100%];
    @apply transition-all ease-linear duration-400;
  }
  .showSearchBarFlex {
    @apply flex;
  }
  .showSearchBarWidth {
    @apply w-[60%];
  }
  .course {
    @apply border border-gray-300 border-solid;
  }
  :global(.icon) {
    @apply inline-block h-4 w-4 fill-current leading-4 flex-shrink-0;
  }
</style>