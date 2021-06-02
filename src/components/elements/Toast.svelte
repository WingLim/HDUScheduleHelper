<script>

  import { toast } from '../../lib/store'
  let type = ''
  let content = ''
  let className = ''

  $: if ($toast.has('content')) {
    type = $toast.get('type')
    content = $toast.get('content')
    className = 'show'
  } else {
    className = ''
  }
  
</script>

<div class="{type} {className}">
  {content}
</div>

<style>
  div {
    @apply fixed bottom-4 left-4 z-10;
    @apply bg-white p-4 rounded-lg shadow-lg;
    @apply transition-all transform translate-y-4 duration-400;
    @apply opacity-0 invisible;
    transform-origin: bottom left;
  }
  .show {
    @apply opacity-100 visible;
    @apply translate-y-0;
  }
  .success {
    @apply bg-green-500 text-white;
  }
  .danger {
    @apply bg-red-500 text-white;
  }
</style>