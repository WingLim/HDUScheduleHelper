<script>
  import Table from './Table.svelte'
  import Form from './Form.svelte'
  import Header from './Header.svelte'
  import Button from '../elements/Button.svelte'
  import { boolMoreButton } from '../../lib/store'
  
  export let shown
  export let hideFn

  let page = 0
  function showMore() {
    page += 1
  }
</script>

{#if shown == true}
  <div class="h-full bg-white shadow-xl flex flex-col">
    <Header {hideFn}/>
    <div class="py-4 px-5">
      <Form {page} />
      <div class="pt-2 max-h-[90vh] overflow-auto">
        <Table />
      </div>
      {#if $boolMoreButton}
      <Button className="mt-4" on:click={showMore}>
        查看更多
      </Button>
      {/if}
    </div>
  </div>
{/if}

<style>
  :global(.mt-4) {
    @apply mt-4;
  }
</style>
