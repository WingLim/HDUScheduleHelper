<script lang="ts">
  import { slide } from 'svelte/transition'
  import cheerio from 'cheerio'
  import { CheerioAPI } from 'cheerio'
  import { onMount } from 'svelte'
  import Button from '../components/elements/Button.svelte'
  import Input from '../components/elements/Input.svelte'
  import { apiUrl } from '../config'
  import { times } from '../lib/constant'
  import { addCourse } from '../lib/utils'
  

  let id: string
  let name: string
  let session:string

  let loading = false
  let success = false

  let boolMenu = false
  function toggleMenu() {
    boolMenu = !boolMenu
  }

  const corsUrl = 'https://cors.lim.workers.dev/'
  const scheduleUrl = 'http://jxgl.hdu.edu.cn/xskbcx.aspx'

  function buildCookie(sessionId: string, route: string) {
    let cookie = 'ASP.NET_SessionId=' + sessionId
    cookie += ';route=' + route
    return cookie
  }

  function buildUrl(id: string, name: string, cookie: string) {
    let url = corsUrl + scheduleUrl
    url += '?xh=' + id
    url += '&xm=' + name
    url += '&gnmkdm=N121603'
    url += '|' + cookie
    return url
  }

  async function getMySchedule() {
    loading = true
    let cookie = buildCookie(session, '3d0c690852e4ff1f04aa9cef8f2994ef')
    let url = buildUrl(id, name, cookie)
    await fetch(url)
    .then(resp => {
      if (resp.status == 302) {
        throw 'failed'
      }
      return resp.arrayBuffer()
    })
    .then(buffer => {
      const decoder = new TextDecoder('gb2312')
      const text = decoder.decode(buffer)
      let html = cheerio.load(text)
      exportSchedule(html)
    })
    .catch(err => {
      console.log(err)
    })
  }

  function parseTime(timeinfo: string) {
    let text = timeinfo.split('{')[0]
    let pattern = /(\d+)/g
    let arr = text.match(pattern)
    let startIndex = parseInt(arr[0]) - 1
    let endIndex = parseInt(arr[arr.length - 1]) - 1
    let start = times[startIndex].start
    let end = times[endIndex].end
    return '&time=' + start + ',' + end
  }

  function parseWeek(timeinfo: string) {
    let flag = '0'
    if (timeinfo.match(/双周/)) {
      flag = '2'
    } else if (timeinfo.match(/单周/)) {
      flag = '1'
    }
    let text = timeinfo.split('{')[1]
    let pattern = /(\d+)/g
    let arr = text.match(pattern)
    arr.push(flag)
    
    return '&week_info=' + arr.join(',')
  }

  function buildAPIUrl(arr: Array<string>) {
    let url = apiUrl
    url += 'title=' + arr[0]
    url += '&weekday=' + arr[1].substr(0,2)
    url += '&teacher=' + arr[2]
    url += '&location=' + arr[3]
    url += parseTime(arr[1])
    url += parseWeek(arr[1])
    return url
  }

  function getCourseDetail(arr: Array<string>) {
    fetch(buildAPIUrl(arr))
    .then(function(resp) {
      if (resp.status == 200) {
        loading = false
        success = true
        localStorage.setItem('id', id)
        localStorage.setItem('name', name)
        localStorage.setItem('session', session)
      }
      return resp.json()
    })
    .then(result => {
      addCourse(result[0])
    })
  }

  function exportSchedule(html: CheerioAPI) {
    let tds = html('td')
    tds.each((index, element) => {
      let text = cheerio(element).html()
      if (text) {
        let arr = text.split('<br>')
        if (arr.length < 4) {
          return
        } else {
          getCourseDetail(arr)
        }
      }
    })
  }

  function handleKeydown(event: KeyboardEvent) {
    let key = event.key
    if (key == 'Escape') {
      boolMenu = false
    }
  }

  onMount(() => {
    id = localStorage.getItem('id')
    name = localStorage.getItem('name')
    session = localStorage.getItem('session')
  })
</script>

<svelte:window on:keydown={handleKeydown} />
<div class="relative">
  <Button on:click={toggleMenu} content="获取课表" />
  {#if boolMenu}
  <div transition:slide class="absolute top-[120%] bg-white px-2 py-3 shadow-md rounded-md">
    <div class="flex flex-col gap-2">
      <Input bind:value={id} placeholder="学号" />
      <Input bind:value={name} placeholder="姓名" />
      <Input bind:value={session} placeholder="Session" />
      <Button on:click={getMySchedule} {loading} content="获取" type={success? 'primary': ''} />
    </div>
  </div>
  {/if}
</div>
