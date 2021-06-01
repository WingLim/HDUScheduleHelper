<script>
  import { addCourse } from '../../lib/utils'
  import { searchResult } from '../../lib/store'
  import Item from './TableItem.svelte'

  let tableHeads = [
    '课程',
    '教师',
    '时间',
    '地点',
    '动作'
  ]
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
    {#if item.status == '已开'}
    {#if item.time_info.length == 1}
      <Item {item} {addCourse}/>
    {:else}
      <Item {item} {addCourse} count={2}/>
    {/if}
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
