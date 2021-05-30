<script>
  import Table from './Table.svelte'
  import Form from './Form.svelte'
  import { searchResult, boolMoreButton } from '../../lib/store'
  
  export let shown
  export let hideFn

  let page = 0
  function showMore() {
    page += 1
  }
</script>

{#if shown == true}
  <div class="h-full bg-white shadow-xl flex flex-col">
    <header class="flex justify-between py-3 px-5 items-center">
      <h2 class="m-0">搜索课程</h2>
      <button on:click={hideFn} class="closeBtn hover:shadow-xl" >
        <svg class="icon w-5 h-5" viewBox="0 0 16 16">
          <title>关闭搜索</title>
          <g stroke-width="1" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10">
              <line x1="13.5" y1="2.5" x2="2.5" y2="13.5"></line>
              <line x1="2.5" y1="2.5" x2="13.5" y2="13.5"></line>
          </g>
        </svg>
      </button>
    </header>
    <div class="py-4 px-5">
      <Form {page} />
      <div class="pt-2 max-h-[90vh] overflow-auto">
        <Table />
      </div>
      {#if $boolMoreButton}
      <button class="btn mt-4" on:click={showMore}>
        查看更多
      </button>
      {/if}
    </div>
  </div>
{/if}

<style>
  header {
    @apply border-gray-300 border-0 border-b border-solid;
  }
  .closeBtn {
    @apply flex justify-center items-center;
    @apply bg-white w-10 h-10 border-0 shadow-md rounded-full cursor-pointer;
  }
</style>