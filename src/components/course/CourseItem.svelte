<script>
  import { fade } from 'svelte/transition'
  import { onMount } from 'svelte'
  import { courses, idMap } from '../../lib/store'

  export let options = {}

  let style = ''
  let course = options.course
  let info = options.timeInfo
  let colors = [
    'cyan',
    'blue',
    'teal',
    'red',
    'true-gray',
  ]
  let randomIndex = Math.floor(Math.random() * colors.length)
  let randomColor = colors[randomIndex]
  let boolDeleteBtn = false

  onMount(() => {
    let pos = options.position
    handlePosition(pos.row_start, pos.row_end, pos.col_start)
  })

  function handlePosition(row_start, row_end, col_start) {
    style += 'grid-row-start: ' + row_start +';'
    style += 'grid-row-end: ' + row_end + ';'
    style += 'grid-column-start: ' + col_start + ';'
  }

  function handleRemove(id) {
    let keys = $idMap.get(id)
    keys.forEach(key => {
      $courses.delete(key)
    })
    $idMap.delete(id)
    $courses = $courses
    $idMap = $idMap
  }

  function showDeleteBtn() {
    boolDeleteBtn = true
  }
  function hideDeleteBtn() {
    boolDeleteBtn = false
  }

</script>

<div on:mouseover={showDeleteBtn} on:mouseleave={hideDeleteBtn} transition:fade class="course {randomColor} {options.warn === true ? 'warn' : ''}" {style}>
  <div class="h-4">
  {#if boolDeleteBtn}
  <button transition:fade on:click={() => handleRemove(options.id)} class="removeBtn hover:shadow-lg">
    <svg class="icon" viewBox="0 0 16 16">
      <title>删除课程</title>
      <g stroke-width="1" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10">
        <line x1="13.5" y1="2.5" x2="2.5" y2="13.5"></line>
        <line x1="2.5" y1="2.5" x2="13.5" y2="13.5"></line>
      </g>
    </svg>
  </button>
  {/if}
  </div>
  <p>{course.title}</p>
  <p>{course.teacher}</p>
  <p>{info.location}</p>
</div>

<style>
@keyframes glow {
  0% {
    @apply border-red-50;
  }
  100% {
    @apply border-red-500;
  }
}
.warn {
  animation: glow 200ms ease-out 4 alternate;
}
.course {
  @apply border border-4 border-solid border-transparent;
  @apply rounded-lg text-light-500 m-1;
}
.removeBtn {
  @apply bg-transparent w-6 h-6 text-light-500;
  @apply flex items-center justify-center;
  @apply border-0 cursor-pointer rounded-full shadow-md;
}
.cyan {
  @apply bg-cyan-700;
}
.blue {
  @apply bg-light-blue-700;
}
.teal {
  @apply bg-teal-700;
}
.red {
  @apply bg-red-400;
}
.true-gray {
  @apply bg-true-gray-500;
}
</style>