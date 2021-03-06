import { writable } from 'svelte/store'
import { weekdays } from './constant'

export let courses = writable(new Map())
export let idMap = writable(new Map())

export let searchResult = writable([])
export let boolMoreButton = writable(true)
export let loadingMore = writable(false)

export let weekdaysStore = writable(weekdays)

export let boolSaveToLocal = writable(true)
export let boolWeekendMode = writable(false)
export let boolSearchBar = writable(true)

export let toast = writable(new Map())