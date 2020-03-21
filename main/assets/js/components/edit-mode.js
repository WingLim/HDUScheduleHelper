const schedule_events = document.getElementById('schedule_events').getElementsByTagName('li')
const edit_mode = document.getElementById('edit_mode')
const delete_btn = document.getElementsByClassName('delete-course')
function setCourseClick(func) {
    for(let i=0; i<schedule_events.length; i++) {
        if(schedule_events[i].classList.contains('cd-schedule__event')){
            schedule_events[i].setAttribute('onclick', func)
        }
    }
}

function showDeleteBtn(style) {
    for(let i=0; i<delete_btn.length; i++) {
        delete_btn[i].style.display = style
    }
}

function initEditMode() {
    if(!edit_mode.checked) {
        setCourseClick('showDetail(this)')
        showDeleteBtn('none')
    } else {
        setCourseClick('')
        showDeleteBtn('block')
    }
}

function deleteCourse (obj) { 
    obj.parentNode.parentNode.removeChild(obj.parentNode)
}
