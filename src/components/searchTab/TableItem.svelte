<script>
  import Button from '../elements/Button.svelte'
  import { onMount } from 'svelte'
  import { slide } from 'svelte/transition'

  export let item
  export let addCourse
  export let count = 1

  let boolDetail = false

  function toggleDetail() {
    boolDetail = !boolDetail
  }

  let rowspan = 1
  onMount(() => {
    if (count == 2) {
      rowspan = 2
    }
  })
</script>

<tr>
  <td {rowspan} class="p-2">
    <button title="查看详情" on:click={toggleDetail} class="expand hover:border-blue-600 {!boolDetail ? 'collapsed': ''}"></button>
  </td>
  <td {rowspan}>{item.title}</td>
  <td {rowspan}>{item.teacher}</td>
  <td rowspan="1" colspan="2">
    <div class="time-location">
      <div>
        <p class="weekday">{item.time_info[0].weekday}</p>
        <span>{item.time_info[0].start}-{item.time_info[0].end}</span>
      </div>
      <div>
        {item.time_info[0].location}
      </div>
    </div>
  </td>
  <td {rowspan}>
    <Button className="m-2" clickFn={() => addCourse(item)}>选择</Button>
  </td>
</tr>
{#if count == 2}
<tr>
  <td rowspan="1" colspan="2">
    <div class="time-location">
      <div>
        <p>{item.time_info[1].weekday}</p>
        <span>{item.time_info[1].start}-{item.time_info[1].end}</span>
      </div>
      <div>
        {item.time_info[1].location}
      </div>
    </div>
  </td>
</tr>
{/if}

{#if boolDetail}
<td colspan="6">
  <div transition:slide class="flex flex-col detail">
    <p>选课课号: {item.class_id}</p>
    <p>学分: {item.credit}</p>
    <p>考核方式: {item.method}</p>
    <p>课程性质: {item.property}</p>
    <p>起止周: {item.week_info.start}-{item.week_info.end}</p>
    {#if item.week_info.flag == 1}
    <p>单周</p>
    {:else if item.week_info.flag == 2}
    <p>双周</p>
    {/if}
    <p>开课学院: {item.academic}</p>
  </div>
</td>
{/if}

<style>
  :global(.m-2) {
    @apply m-2;
  }
  .expand {
    @apply inline-flex bg-white cursor-pointer relative;
    @apply border border-solid border-gray-100 box-border;
    @apply p-0 h-[17px] w-[17px];
  }
  .expand::before, .expand::after {
    @apply bg-current absolute;
    @apply transition-transform duration-300 ease-out;
    content: "";
  }
  .expand::before {
    @apply h-px;
    @apply left-[3px] right-[3px] top-[7px];
  }
  .expand::after {
    @apply w-px;
    @apply bottom-[3px] left-[7px] top-[3px];
    @apply transform rotate-90;
  }
  .collapsed::before {
    @apply transform -rotate-180;
  }
  .collapsed::after {
    @apply transform rotate-0;
  }
  tr {
    @apply border-gray-200 border-0 border-b border-solid;
  }
  .time-location {
    @apply flex justify-between items-center;
  }
  .time-location p {
    @apply m-0;
  }
  .time-location span {
    @apply text-gray-500;
  }
  .detail {
    @apply p-2;
  }
  .detail p {
    @apply text-left m-0;
  }
</style>