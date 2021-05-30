<script>
  import Course from './course/Course.svelte'
  import SearchCourses from './searchTab/Search.svelte'
  import { courses, idMap } from '../lib/store'
  import { times, weekdays } from '../lib/constant'

  let boolSearch = true
  function showSearch() {
    boolSearch = true
  }

  function hideSearch() {
    boolSearch = false
  }

  function removeFn(id) {
    let keys = $idMap.get(id)
    keys.forEach(key => {
      $courses.delete(key)
    })
    $idMap.delete(id)
    $courses = $courses
    $idMap = $idMap
  }
</script>

<div class="{boolSearch ? 'showSearchBarFlex': ''}" >
  <div class="main {boolSearch ? 'showSearchBarWidth': ''}">
  <div class="flex justify-between px-5 items-center">
    <h1 class="m-0">HDU 课程助手</h1>
    <div>
      <button on:click={showSearch} class="btn btn-primary">
        <svg class="icon mr-1" viewBox="0 0 24 24">
          <g stroke-linecap="square" stroke-linejoin="miter" stroke-width="2" stroke="currentColor" fill="none" stroke-miterlimit="10">
              <line x1="22" y1="22" x2="15.656" y2="15.656"></line>
              <circle cx="10" cy="10" r="8"></circle>
          </g>
        </svg>
        搜索课程
      </button>
    </div>
  </div>
  <div class="grid grid-cols-8 grid-rows-12 w-full">
    <div class="col-start-1 row-start-1 scheduleTableBorder"></div>
    {#each times as time, i}
    <div id="time-{i+1}" class="odd:bg-gray-100 p-y-1 col-start-1">
      <p class="m-0 text-xl">{i+1}</p>
      <p class="m-0 text-sm text-gray-400">{time.start}</p>
      <p class="m-0 text-sm text-gray-400">{time.end}</p>
    </div>
    {/each}
    
    {#each weekdays as weekday, i}
    <div class="row-start-1 col-start-{i + 2} flex items-center justify-center scheduleTableBorder">
      <p class="m-0 text-xl">{weekday}</p>
    </div>
    {/each}

    {#each [...$courses] as [key, options] (key) }
      <Course {options} {removeFn}/>
    {/each}
  </div>
  </div>
  <div class="searchBar {boolSearch ? 'searchBarWidth': ''}">
    <SearchCourses shown={boolSearch} hideFn={() => hideSearch()} />
  </div>
</div>

<style>
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
  :global(.btn) {
    @apply inline-flex justify-center items-center;
    @apply text-black border-0 rounded-md p-2 text-base shadow-md cursor-pointer;
  }
  :global(.btn:hover) {
    @apply shadow-lg;
  }
  :global(.btn-primary) {
    @apply bg-blue-600 text-white;
  }
</style>