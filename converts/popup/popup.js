
let choice = {};
const choiceConvert = document.getElementById("getChoiceConvert"),
      optionConvert = document.getElementById("convertOption");
const programsFoggy =['Мультистрелок v2','Мультистрелок v3','Хаммер v3'
    ,'Мелкий ремонт','Средний ремонт','Крупный ремонт','Автомеханик','Антилуч','Силовое поле'
    ,'Щит архонтов','Ловушка архонтов','Механик','Инженер','Мастер','Форсаж','Перерождение'
    ,'Пиратский рейд','Суперкарго','Тренер','Трансмиттер','Дубликатор','Делевл','Эфирный локатор'
    ,'Тюнинг','Сердечник','Часть накопителя','Часть дроида','Космоботинок','Аквамарин смелости А'
    ,'Аквамарин смелости Л','Аквамарин смелости Г','Аквамарин ярости АС','Аквамарин ярости Л'
    ,'Аквамарин ярости Г','Лазурит спокойствия АС','Лазурит спокойствия АЯ','Лазурит спокойствия Г'
    ,'Гранат страсти АС','Гранат страсти АЯ','Гранат страсти Л'];
const programsSpace = ['Крупная деталь','Строительный модуль','Знак тьмы','Знак света']

// Отправка команды в таб
async function sendCommand(action, payload = {}) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) {
        chrome.tabs.sendMessage(tab.id, { action, ...payload });
    }
}

function loadchoice (station = 'foggy') {
    let itemBuild = station ==='foggy'? programsFoggy : programsSpace;
    document.querySelector('body').className = station;
    optionConvert.innerHTML =`
                <label>
                    Какую сборку собираем:
                    <select id="choiceBuild"></select>
                </label>
                <label>
                    Сколько собираем: 
                    <input type="number" id="countBuild" min="0">
                </label>
                `;
    for (let i = 0; i < itemBuild.length; i++){
        document.getElementById('choiceBuild')
        .insertAdjacentHTML('beforeend',`
                  <option value="${i}">${itemBuild[i]}</option>`);
    };
}

choiceConvert.addEventListener('change', (e)=>{
    loadchoice(e.target.value)
})

document.getElementById('start').onclick = () => {
    choice.convert = choiceConvert.value
    choice.build = document.getElementById('choiceBuild').value
    choice.buildCount = document.getElementById('countBuild').value
    sendCommand('start',choice);
};
document.getElementById('stop').onclick = () => {
    sendCommand('stop');
};
loadchoice()