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
        <button class="delete-course reset" onclick="deleteCourse(this)" style="position: absolute;right: 5px;top: 5px; color: #fff; cursor: pointer;">
            <svg class="icon" viewBox="0 0 16 16"><title>删除课程</title><g stroke-width="1" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"><line x1="13.5" y1="2.5" x2="2.5" y2="13.5"></line><line x1="2.5" y1="2.5" x2="13.5" y2="13.5"></line></g></svg>
        </button>
        </li>`
    return html
}
