<script>
  import { getPosition } from '../../lib/utils'
  import { courses, idMap, searchResult } from '../../lib/store'
  import Item from './TableItem.svelte'

  let tableHeads = [
    '课程',
    '教师',
    '时间',
    '地点',
    '动作'
  ]

  function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

  function addCourse(course) {
    let id = course.class_id
    let infos = course.time_info

    let conflict = false
    var conflictKeys = []
    
    infos.forEach(info => {
      let position = getPosition(info.start, info.end, info.weekday)
      let key = getPositionString(position)
      if ($courses.has(key)) {
        conflictKeys.push(key)
        conflict = true
      }
    })

    if (conflict) {
      conflictKeys.forEach(key => {
        $courses.get(key).warn = true
        $courses = $courses

        sleep(500).then(() => {
          if ($courses.has(key)) {
            $courses.get(key).warn = false
            $courses = $courses
          }
        })
      })
      
    } else {
      let keys = []
      infos.forEach(info => {
        let position = getPosition(info.start, info.end, info.weekday)
        let key = getPositionString(position)
        keys.push(key)
        let options = {id: id, course: course, timeInfo: info, position: position, warn: false}
        $courses.set(key, options)
        $courses = $courses
      })
      $idMap.set(id, keys)
      $idMap = $idMap
    }
  }

  function getPositionString(position) {
    let str = ''
    str += position.row_start
    str += position.row_end
    str += position.col_start
    return str
  }
</script>

<table class="w-full">
  {#if $searchResult.length != 0}
  <thead>
    <tr>
      <th></th>
      {#each tableHeads as head}
      <th>{head}</th>
      {/each}
    </tr>
  </thead>
  {/if}
  <tbody>
    
    {#each $searchResult as item}
    {#if item.time_info.length == 1}
      <Item {item} {addCourse}/>
    {:else}
      <Item {item} {addCourse} count={2}/>
    {/if}
    {/each}

  </tbody>
</table>

<style>
  table {
    @apply border-collapse;
  }
  thead > tr > th {
    @apply border-0 border-b border-solid border-gray-200;
    @apply bg-gray-100  p-2;
  }
</style>
