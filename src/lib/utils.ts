import { times, weekdays, weekend } from './constant'
import { boolSaveToLocal, courses, idMap, toast } from './store'
import { get_store_value } from 'svelte/internal'
import { Writable } from 'svelte/store'

export function getPosition(start: string, end: string, weekday: string) {
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
  weekdays.concat(weekend).forEach((item, index) => {
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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getPositionString(position) {
  let str = ''
  str += position.row_start
  str += position.row_end
  str += position.col_start
  return str
}

function updateWritable(write: Writable<any>) {
  write.update(write => write)
}


function $<T>(item: Writable<T>): T {
  return get_store_value(item)
}

export function addCourse(course) {
  let id = course.class_id
  let infos = course.time_info

  let conflict = false
  var conflictKeys = []
  
  infos.forEach(info => {
    let position = getPosition(info.start, info.end, info.weekday)
    let key = getPositionString(position)
    let tmpStart = parseInt(key[0], 10)
    let tmpEnd = parseInt(key[1], 10)
    let count =  tmpEnd - tmpStart
    if (count == 3) {
      let tmpKey = String(tmpStart) + String(tmpEnd - 1) + key[2]
      if ($(courses).has(tmpKey)) {
        conflictKeys.push(tmpKey)
        conflict = true
      }
    } else if (count == 2) {
      let tmpKey = String(tmpStart) + String(tmpEnd + 1) + key[2]
      if ($(courses).has(tmpKey)) {
        conflictKeys.push(tmpKey)
        conflict = true
      }
    }
    let tmpKey = String(tmpStart - 1) + String(tmpEnd) + key[2]
    if ($(courses).has(tmpKey)) {
      conflictKeys.push(tmpKey)
      conflict = true
    }
    if ($(courses).has(key)) {
      conflictKeys.push(key)
      conflict = true
    }
  })

  if (conflict) {
    conflictKeys.forEach(key => {
      $(courses).get(key).warn = true
      updateWritable(courses)

      hint('课程冲突', 'danger')

      sleep(500).then(() => {
        if ($(courses).has(key)) {
          $(courses).get(key).warn = false
          updateWritable(courses)
        }
      })
    })
    
  } else {
    let keys = []
    infos.forEach(info => {
      let position = getPosition(info.start, info.end, info.weekday)
      let key = getPositionString(position)
      keys.push(key)
      let options = {id: id, course: course, timeInfo: info, position: position, warn: false}
      $(courses).set(key, options)
      updateWritable(courses)
      hint('添加成功')
    })
    $(idMap).set(id, keys)
    updateWritable(idMap)
    saveToLocal()
  }
}

export function hint(content: string, type: string = 'success', duration: number = 3000) {
  $(toast).set('content', content)
  $(toast).set('type', type)
  updateWritable(toast)
  sleep(duration).then(() => {
    $(toast).clear()
    updateWritable(toast)
  })
}
