function insert (id, html) {
    ul = document.getElementById(id)
    ul.insertAdjacentHTML('beforeend', html)
}

function findplace(weekday, ele){
    switch (weekday) {
        case '周一':
            insert('1', ele)
            break;
        case '周二':
            insert('2', ele)
            break;
        case '周三':
            insert('3', ele)
            break;
        case '周四':
            insert('4', ele)
            break;
        case '周五':
            insert('5', ele)
            break;
        case '周六':
            insert('6', ele)
            break;
        case '周日':
            insert('7', ele)
            break;
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
            findplace(course.timeinfo.weekday, ele)
        });
        renderSchedule()
    })
    .catch(function (err) {
        console.log(err)
    });