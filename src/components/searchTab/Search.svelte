<script>
  import Table from './Table.svelte'
  import Form from './Form.svelte'
  
  export let shown
  export let hideFn
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
      <Form />
      <div class="pt-2">
        <Table />
      </div>
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