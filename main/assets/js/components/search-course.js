HTMLFormElement.prototype.serialize = function () {
    var form = this;
    // 表单数据
    var arrFormData = [], objFormData = {};

    [].slice.call(form.elements).forEach(function (ele) {
        // 元素类型和状态
        var type = ele.type, disabled = ele.disabled;

        // 元素的键值
        var name = ele.name, value = encodeURIComponent(ele.value || '');

        // name参数必须，元素非disabled态，一些类型忽略
        if (!name || disabled || !type || (/^reset|submit|image$/i.test(type)) || (/^checkbox|radio$/i.test(type) && !ele.checked)) {
            return;
        }

        type = type.toLowerCase();

        if (type !== 'select-multiple') {
            if (objFormData[name]) {
                objFormData[name].push(value);
            } else {
                objFormData[name] = [value];
            }
        } else {
            [].slice.call(ele.querySelectorAll('option')).forEach(function (option) {
                var optionValue = encodeURIComponent(option.value || 'on');
                if (option.selected) {
                    if (objFormData[name]) {
                        objFormData[name].push(optionValue);
                    } else {
                        objFormData[name] = [optionValue];
                    }
                }
            });
        }
    });

    for (var key in objFormData) {
        arrFormData.push(key + '=' + objFormData[key].join('第'));
    }

    return arrFormData.join('&');
};

function createlist(ele) {
    let courses_list = document.getElementById("courses_list")
    if (courses_list == null) {
        let html = `
                <table class="table table--expanded@sm js-table width-100%" aria-label="Table Example">
                    <thead class="table__header table__header--sticky">
                      <tr class="table__row">
                        <th class="table__cell text-left" scope="col">课程</th>
                        <th class="table__cell text-left" scope="col">教师</th>
                        <th class="table__cell text-left" scope="col">地点</th>
                        <th class="table__cell text-left" scope="col">时间</th>
                        <th class="table__cell text-left" scope="col">动作</th>
                      </tr>
                    </thead>
                    
                    <tbody class="table__body" id="courses_list">

                    </tbody>
                </table>`
        ele.insertAdjacentHTML('beforeend', html)
    }
}

function empty() {
    let courses_list = document.getElementById("courses_list")
    if (courses_list != null) {
        courses_list.innerHTML = ""
    }
}

function insert2list(ele, data) {
    let coursestr = JSON.stringify(data)
    let html = `
    <tr class="table__row"> 
        <td class="table__cell" role="cell">${data.title}</td>        
        <td class="table__cell" role="cell">${data.teacher}</td>        
        <td class="table__cell" role="cell">${data.location}</td>
        <td class="table__cell" role="cell">${data.time}</td>              
        <td class="table__cell" role="cell"> 
            <button class="btn btn--subtle" onclick="select(this)" data-content='${coursestr}'>
            <span class="btn__content-a">选择</span>
                              
            <span class="btn__content-b">
              <svg class="icon icon--is-spinning" aria-hidden="true" viewBox="0 0 16 16"><title>Loading</title><g stroke-width="1" fill="currentColor" stroke="currentColor"><path d="M.5,8a7.5,7.5,0,1,1,1.91,5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path></g></svg>
            </span>
            <span class="btn__content-c">成功</span>
            <span class="btn__content-d">课程冲突</span>
            </button>
        </td>
    </tr>`
    ele.insertAdjacentHTML('beforeend', html)
}

function is_course_exist(start, place) {
    let column = document.getElementById(place)
    let a_list = column.getElementsByTagName('a')
    for (let i = 0; i < a_list.length; i++) {
        if (a_list[i].getAttribute('data-start') == start) {
            return true
        }
    }
    return false
}

function select(obj) {
    let succeed = document.getElementById('select-succeed')
    let failed = document.getElementById('select-failed')
    let str = obj.getAttribute('data-content')
    let json = JSON.parse(str)
    let html = create(json)
    let place = findplace(json.timeinfo.weekday)
    if (is_course_exist(json.timeinfo.start, place)) {
        showHint(failed)
    } else {
        insert(place, html)
        renderSchedule()
        showHint(succeed)
    }
}

const advance = document.getElementById("advance-search")
const advanceform = document.getElementById("advance-form")
advance.addEventListener('click', function (e) {
    e.preventDefault();
    let html = `

    <div class="margin-bottom-sm flex flex-row">
        <div class="select inline-block js-select flex items-start flex-column" data-trigger-class="btn btn--subtle">
            <label class="form-label margin-bottom-xxxs" for="property">课程性质:</label>
            <select name="property" id="property">
                <optgroup label="必修课">
                    <option value="学科必修">学科必修</option>
                    <option value="专业必修">专业必修</option>
                    <option value="通识必修">通识必修</option>
                    <option value="实践必修">实践必修</option>
                    <option value="课外必修">课外必修</option>
                    <option value="英语必修">英语必修</option>
                </optgroup>
                <optgroup label="公选课">
                    <option value="科技发展与科学精神">科技发展与科学精神</option>
                    <option value="艺术创作与审美体验">艺术创作与审美体验</option>
                    <option value="社会发展与公民教育">社会发展与公民教育</option>
                    <option value="文明对话与国际视野">文明对话与国际视野</option>
                    <option value="人文经典与人文修养">人文经典与人文修养</option>
                </optgroup>
                <optgroup label="选修课">
                    <option value="专业选修">专业选修</option>
                    <option value="通识选修">通识选修</option>
                    <option value=""></option>
                </optgroup>
            </select>

            <svg class="icon icon--xs margin-left-xxxs" aria-hidden="true" viewBox="0 0 16 16">
                <polygon points="3,5 8,11 13,5 "></polygon>
            </svg>
        </div>
    
    <div class="select inline-block js-select items-start flex-column margin-left-md" data-trigger-class="btn btn--subtle">
        <label class="form-label margin-bottom-xxxs" for="weekday">日期:</label>
        <select name="time" id="weekday">
            <option value="周一" selected>周一</option>
            <option value="周二">周二</option>
            <option value="周三">周三</option>
            <option value="周四">周四</option>
            <option value="周五">周五</option>
            <option value="周六">周六</option>
            <option value="周日">周日</option>
        </select>

        <svg class="icon icon--xs margin-left-xxxs" aria-hidden="true" viewBox="0 0 16 16">
            <polygon points="3,5 8,11 13,5 "></polygon>
        </svg>
    </div>
    
    <div class="select inline-block js-select margin-left-md" data-trigger-class="btn btn--subtle">
        <label class="form-label margin-bottom-xxxs" for="time">时间:</label>
        <select name="time" id="time">
            <optgroup label="两节课">
                <option value="1,2节" selected>1,2节</option>
                <option value="3,4节">3,4节</option>
                <option value="6,7节">6,7节</option>
                <option value="8,9节">8,9节</option>
                <option value="10,11节">10,11节</option>
            </optgroup>
            <optgroup label="三节课">
                <option value="3,4,5节">3,4,5节</option>
                <option value="6,7,8节">6,7,8节</option>
                <option value="10,11,12节">10,11,12节</option>
            </optgroup>
        </select>

        <svg class="icon icon--xs margin-left-xxxs" aria-hidden="true" viewBox="0 0 16 16">
            <polygon points="3,5 8,11 13,5 "></polygon>
        </svg>
    </div>
`
    let status = !Util.hasClass(advance, 'btn--subtle');
    Util.toggleClass(advance, 'btn--subtle', status);
    if(status) {
        advanceform.innerHTML = "";
    } else {
        advanceform.insertAdjacentHTML('beforeend', html);
    }
    
})

const search = document.getElementById("search")
const searchform = document.getElementById("search-form")
search.addEventListener('click', function (e) {
    e.preventDefault();
    Util.addClass(search, 'btn--state-b')
    empty()
    query = searchform.serialize()
    search_div = document.getElementById("search_div")
    axios.get('https://api.limxw.com/courses/query?' + query)
        .then(function (resp) {
            createlist(search_div)
            renderTable()
            courses_list = document.getElementById("courses_list")
            resp.data.forEach(course => {
                insert2list(courses_list, course)
            })
            Util.removeClass(search, 'btn--state-b')
        })
        .catch(function (err) {
            console.log(err)
        })
});