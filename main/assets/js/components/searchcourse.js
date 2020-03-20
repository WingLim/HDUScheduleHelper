let search = document.getElementById("search")
let form = document.getElementById("search-form")

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
                        <th class="table__cell text-left" scope="col">状态</th>
                        <th class="table__cell text-left" scope="col">课程名</th>
                        <th class="table__cell text-left" scope="col">任课教师</th>
                        <th class="table__cell text-left" scope="col">上课地点</th>
                        <th class="table__cell text-left" scope="col">上课时间</th>
                        <th class="table__cell text-left" scope="col">Action</th>
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
        <td class="table__cell" role="cell">${data.status}</td>  
        <td class="table__cell" role="cell">${data.title}</td>        
        <td class="table__cell" role="cell">${data.teacher}</td>        
        <td class="table__cell" role="cell">${data.location}</td>
        <td class="table__cell" role="cell">${week}</td>              
        <td class="table__cell" role="cell"> 
            <button class="btn btn--subtle add-course" onclick="select(this)" data-content='${coursestr}'>选择</button>
        </td>
    </tr>`
    ele.insertAdjacentHTML('beforeend', html)
}

function select(obj) {
    let str = obj.getAttribute('data-content')
    let json = JSON.parse(str)
    let html = create(json)
    findplace(json.timeinfo.weekday, html)
    renderSchedule()
}

search.addEventListener('click', function (e) {
    e.preventDefault();
    empty()
    query = form.serialize()
    search_div = document.getElementById("search_div")
    axios.get('https://api.limxw.com/courses/query?' + query)
        .then(function (resp) {
            r = resp
            createlist(search_div)
            renderTable()
            courses_list = document.getElementById("courses_list")
            resp.data.forEach(course => {
                insert2list(courses_list, course)
            })
        })
        .catch(function (err) {
            console.log(err)
        })
});