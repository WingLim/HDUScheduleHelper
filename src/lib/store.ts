import { writable } from 'svelte/store'

export let courses = writable(new Map())
export let idMap = writable(new Map())

export let searchResult = writable([])