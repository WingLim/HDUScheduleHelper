import { times, weekdays } from './constant'

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
