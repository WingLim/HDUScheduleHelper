<script lang='ts'>
  import { onMount } from 'svelte'
  import Course from './course/CourseItem.svelte'
  import SearchCourses from './searchTab/Search.svelte'
  import Button from './elements/Button.svelte'
  import Settings from './Settings.svelte'
  import GetSchedule from '../components/GetSchedule.svelte'
  import { courses, idMap, weekdaysStore, boolWeekendMode, boolSearchBar } from '../lib/store'
  import { times, weekend } from '../lib/constant'
  import logo from '../assets/logo.png'

  function toggleSearch() {
    $boolSearchBar = !$boolSearchBar
  }

  function readConfig() {
    $boolWeekendMode = localStorage.getItem('weekendMode') == 'true'
    if ($boolWeekendMode) {
      if ($weekdaysStore.length < 7) {
        $weekdaysStore = [...$weekdaysStore, ...weekend]
      }
    }

    $boolSearchBar = localStorage.getItem('defaultSearch') == 'true'

    let coursesStr = localStorage.getItem('courses')
    $courses = new Map(JSON.parse(coursesStr))
    
    let idMapStr = localStorage.getItem('idMap')
    $idMap = new Map(JSON.parse(idMapStr))
  }

  onMount(() => {
    readConfig()
  })
</script>

<div class="{$boolSearchBar ? 'showSearchBarFlex': ''}" >
  <div class="main {$boolSearchBar ? 'showSearchBarWidth': ''}">
  <div class="flex justify-between px-5 items-center <sm:px-0">
    <h1 class="m-0 flex text-light-blue-600 <xs:text-base <sm:text-lg">
      <img class="w-10 h-10 <xs:w-5 <xs:h-5" src={logo} alt="" />
      HDU 课程助手
    </h1>
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
  <div class="searchBar {$boolSearchBar ? 'searchBarWidth': ''}">
    <SearchCourses />
  </div>
</div>

<style>
  .schedule {
    @apply grid w-full;
    grid-template-rows: repeat(12, 5rem);
  }
  .weekdayMode {
    grid-template-columns: 8rem repeat(5, minmax(0, 1fr));
  }
  .weekendMode {
    grid-template-columns: 8rem repeat(7, minmax(0, 1fr));
  }
  .scheduleTableBorder {
    @apply border-gray-300 border-0 border-b border-solid;
  }
  .searchBar {
    @apply w-0;
    @apply transition-width ease-linear duration-400;
    will-change: width;
  }
  .searchBarWidth {
    @apply w-[40%] <sm:w-full;
  }
  .showSearchBarWidth div {
    @apply <sm:hidden;
  }
  .showSearchBarFlex {
    @apply flex;
  }
  .main {
    @apply w-full;
    @apply transition-width ease-linear duration-400;
    will-change: width;
  }
  .showSearchBarWidth {
    @apply w-[60%] <sm:w-0;
  }
  .course {
    @apply border border-gray-300 border-solid;
  }
  :global(.icon) {
    @apply inline-block h-4 w-4 fill-current leading-4 flex-shrink-0;
  }
</style>