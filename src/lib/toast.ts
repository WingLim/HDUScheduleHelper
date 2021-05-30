import { toast } from '@zerodevx/svelte-toast'

export const danger = msg => toast.push(msg, {
  theme: {
    '--toastBackground': '#F56565',
    '--toastProgressBackground': '#C53030'
  }
})