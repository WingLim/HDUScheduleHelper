const gain_schedule = document.getElementById('gain-schedule');
const gain_form = document.getElementById('gain-form');
const gain_btn = document.getElementById('gain-btn');
const gain_save = document.getElementById('gain-save');
const gain_xh = document.getElementById('gain-xh');
const gain_pwd = document.getElementById('gain-pwd');

gain_btn.addEventListener('click', function(e) {
    e.preventDefault();
    let gain_query = gain_form.serialize()
    Util.addClass(gain_btn, 'btn--state-b')
    function removeState() {
        Util.removeClass(gain_btn, 'btn--state-b')
        closeGain = new CustomEvent('closeModal')
        gain_schedule.dispatchEvent(closeGain)
    }
    url = 'https://api.limxw.com/schedule/json?' + gain_query
    gainSchedule(url, gain_save.checked, removeState)
})

function gainSchedule(url, save, func) {
    axios.get(url)
        .then(function (resp) {
            insertSchedule(resp.data)
            if(save) {
                saveDefauleSchedule(resp.data)
            }
            func()
        })
        .catch(function (err) {
            console.log(err)
        });
}