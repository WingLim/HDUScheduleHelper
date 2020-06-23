const default_notice = document.getElementById('default-notice')
const load_default = document.getElementById('load-default')
function saveDefauleSchedule(json) {
    str = JSON.stringify(json)
    localStorage.setItem("defaultSchedule", str)
}

function isDefaultSchedule() {
    let defaultSchedule = localStorage.getItem('defaultSchedule')
    if(defaultSchedule != '' && defaultSchedule != null) {
        return true
    } else {
        return false
    }
}

function insertSchedule(schedule) {
    schedule.forEach(course => {
        let ele = create(course)
        let place = course.timeinfo.weekday
        insert(place, ele)
    });
    renderSchedule()
    initEditMode()
}

load_default.addEventListener('click', function() {
    let defaultSchedule = JSON.parse(localStorage.getItem('defaultSchedule'))
    insertSchedule(defaultSchedule)
})

if (isDefaultSchedule()) {
    default_notice.style.display = 'block'
} else {
    // for test
    // gainSchedule('https:/api.limxw.com/schedule/json/18011317')
};