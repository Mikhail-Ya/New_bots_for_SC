
let choice = {};
const numberBeetes = document.getElementById('number_beetles'),
    toPut = document.getElementById('put'),
    bugCompletions = document.getElementById('bug_completions'),
    complect = document.getElementById('complect'),
    downup = document.getElementById('downup'),
    nonAbils = document.getElementById('non_abils'),
    abils = document.querySelectorAll('.section_abil input');

// загрузка настроек на панель
async function loadSettings(point) {
    const saved = point == "1" ? await JSON.parse(localStorage.getItem('bugs_going1'))
                        : await JSON.parse(localStorage.getItem('bugs_going'));

    choice = saved;
    choice.point = point;

    toPut.value = Array.isArray(saved.toPut)
        ? saved.bugsLvlAndComplects.map(pair => pair.join(',')).join('|')
        : saved.toPut;
    numberBeetes.value = saved.bugChoice;
    bugCompletions.value = Array.isArray(saved.bugsLvlAndComplects)
        ? saved.bugsLvlAndComplects.map(pair => pair.join(',')).join('|')
        : saved.bugsLvlAndComplects;
    complect.checked = saved.complect ?? true;
    downup.checked = saved.downup ?? true;
    nonAbils.checked = saved.nonAbils ?? true;
    abils.forEach((elem, i) => elem.value = saved.abils[i] );
}

// Сохранение
document.getElementById('save').onclick = async () => {
    const settings = {
        toPut: toPut.value.length > 1 ?
                toPut.value.split('|').map(pairStr => pairStr.split(',').map(Number))
                .filter(pair => pair.length === 2) : toPut.value,
        bugChoice: numberBeetes.value,
        bugsLvlAndComplects: bugCompletions.value.length > 1 ?
            (bugCompletions.value)
                    .split('|').map(pairStr => pairStr.split(',').map(Number))
                    .filter(pair => pair.length === 2)
            : document.getElementById('bug_completions').value,
        complect: complect.checked,
        downup: downup.checked,
        nonAbils: nonAbils.checked,
        abils: Array.from(abils).map(elem => elem.value),
    };

    const obj = JSON.stringify(settings);
    if(document.getElementById('number_beetles').value === '1') {
        await localStorage.setItem('bugs_going1', obj);
    } else {
        await localStorage.setItem('bugs_going', obj);
    }
    alert('Сохранено!');
};

// Отправка команды в таб
async function sendCommand(action, payload = {}) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) {
        chrome.tabs.sendMessage(tab.id, { action, ...payload });
    }
}
const changeForm = (val)=>{
    if(val === '1'){
        document.getElementById('bug_completion').innerHTML =`
                <label for="bug_completions">Уровни жуков и комплекты (формат: "уровень,
                 номер комплекта сверху вниз"):</label>
                <input type="text" id="bug_completions" placeholder="8,1|12,3|15,2|20,4|25,1">
                `;
        document.getElementById('labl_put').innerHTML =`
                    Каким ставить жуков (формат "уровень, участников в забеге"):
                    <input type="text" id="put" placeholder="0,3|5,3|7,3|8,2|9,3">
                `;
    } else {
        document.getElementById('bug_completion').innerHTML =`
                <label for="bug_completions">Какой комплект по счету(сверху в низ):
                    <input type="number" id="bug_completions" value="1" min="1" max="5">
                </label>
                `;
        document.getElementById('labl_put').innerHTML =`
                Каким ставить жука:
                    <input type="number" id="put" value="0" min="0" max="3">
                `;
    }
    loadSettings(val)
}

document.getElementById('start').onclick = () => {

    sendCommand('start',choice);
};
document.getElementById('stop').onclick = () => {
    sendCommand('stop');
};

document.getElementById('number_beetles')
        .addEventListener('change', (e) => {
            if(e.target.value === '1') {
                changeForm('1')
            } else if (e.target.value === '0') {
                changeForm('0')
            }
        })

// Загрузка при открытии popup
loadSettings('0');