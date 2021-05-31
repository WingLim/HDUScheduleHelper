import { times, weekdays } from './constant'
import { boolSaveToLocal, courses, idMap } from './store'
import { get_store_value } from 'svelte/internal'

export function getPosition(start, end, weekday) {
  let startIndex = 0
  let endIndex = 0
  let weekdayIndex = 0
  times.forEach((item, index) => {
    if (item.start == start) {
      startIndex = index + 2
    } else if (item.end == end) {
      endIndex = index + 3
    }
  })
  weekdays.forEach((item, index) => {
    if (item == weekday) {
      weekdayIndex = index + 2
    }
  })

  return {
    row_start: startIndex,
    row_end: endIndex,
    col_start: weekdayIndex
  }
}

export function saveToLocal() {
  if (get_store_value(boolSaveToLocal)) {
    let coursesStr = JSON.stringify(Array.from(get_store_value(courses).entries()))
    localStorage.setItem('courses', coursesStr)

    let idMapStr = JSON.stringify(Array.from(get_store_value(idMap).entries()))
    localStorage.setItem('idMap', idMapStr)
  }
}
