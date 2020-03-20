let insert = (weekday, html) => {
    ul = document.getElementById(weekday)
    ul.insertAdjacentHTML('beforeend', html)
}
let create = (start, end, title, info) => {
    range = parseInt(Math.random() * 3 +1)
    html = `<li class="cd-schedule__event">
        <a data-start="${start}" data-end="${end}" href="#0" data-content="${info}" data-event="event-${range}">
            <em class="cd-schedule__name">${title}</em>
           
        </a>
        </li>`
    return html
}

axios.get('https://api.limxw.com/schedule/json/18011317')
    .then(function (resp) {
        r = resp
        resp.data.forEach(course => {
            time = course.timeinfo
            info = `${course.teacher}+${time.week.start}+${time.week.end}+${time.week.flag}+${course.location}`
            ele = create(
                time.start,
                time.end,
                course.name,
                info
            )
            switch (time.weekday) {
                case 1:
                    insert('1', ele)
                    break;
                case 2:
                    insert('2', ele)
                    break;
                case 3:
                    insert('3', ele)
                    break;
                case 4:
                    insert('4', ele)
                    break;
                case 5:
                    insert('5', ele)
                    break;
                case 6:
                    insert('6', ele)
                    break;
                case 7:
                    insert('7', ele)
                    break;
            }
        });
        renderSchedule()
    })
    .catch(function (err) {
        console.log(err)
    })