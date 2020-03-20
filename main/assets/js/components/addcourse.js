function insert (id, html) {
    ul = document.getElementById(id)
    ul.insertAdjacentHTML('beforeend', html)
}

function findplace(weekday){
    switch (weekday) {
        case '周一':
            return '1';
        case '周二':
            return '2'
        case '周三':
            return '3'
        case '周四':
            return '4'
        case '周五':
            return '5'
        case '周六':
            return '6'
        case '周日':
            return '7'
    }
}
function create (course) {
    range = parseInt(Math.random() * 3 +1)
    time = course.timeinfo
    info = JSON.stringify(course)
    html = `<li class="cd-schedule__event">
        <a data-start="${time.start}" data-end="${time.end}" href="#0" data-content='${info}' data-event="event-${range}">
            <em class="cd-schedule__name">${course.title}</em>
           
        </a>
        </li>`
    return html
}


axios.get('https://api.limxw.com/schedule/json/18011317')
    .then(function (resp) {
        r = resp
        resp.data.forEach(course => {
            let ele = create(course)
            let place = findplace(course.timeinfo.weekday)
            insert(place, ele)
        });
        renderSchedule()
    })
    .catch(function (err) {
        console.log(err)
    });