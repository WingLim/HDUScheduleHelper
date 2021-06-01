<script>
  import { createEventDispatcher } from 'svelte'
  import Table from './Table.svelte'
  import Form from './Form.svelte'
  import Header from './Header.svelte'
  import Button from '../elements/Button.svelte'
  import { boolMoreButton } from '../../lib/store'
  
  const dispatch = createEventDispatcher()

  export let shown

  function handleClick() {
    dispatch('click')
  }

  let page = 0
  function showMore() {
    page += 1
  }
</script>

{#if shown == true}
  <div class="h-full bg-white shadow-xl flex flex-col">
    <Header on:click={handleClick}/>
    <div class="py-4 px-5">
      <Form {page} />
      <div class="pt-2 max-h-[90vh] overflow-auto">
        <Table />
      </div>
      {#if $boolMoreButton}
      <Button className="mt-4" on:click={showMore} content="查看更多" />
      {/if}
    </div>
  </div>
{/if}

<style>
  :global(.mt-4) {
    @apply mt-4;
  }
</style>
