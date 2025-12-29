// --- ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ---
let isRunning = false;
let timeId = 0;
let timer = 0;
const getMainWindow =(name = 'main')=> document
          .getElementsByName(name + "Window")[0].contentDocument




const clearTimeoutAll =()=>{
    let last_timeout = setTimeout(()=>{},0)
    for(let i = timeId; i <= last_timeout; i++){
        clearTimeout(i)
    }
    timeId = last_timeout;
}

// конвертер foggy
const setBuildItems =(item)=> {
    return new Promise((resolve, reject) => {
    let allBuilds = getMainWindow().querySelectorAll('#items_div img')
    allBuilds[item].click()
        setTimeout(() => resolve(true), 2000);
    })
}
const buildIterval =(count)=> {
    let rndTime = Math.floor((Math.random()*500)) + 1000;
    if(count > 0 && isRunning){
        getMainWindow().getElementById('but1').click()
        count--
        setTimeout(()=>{buildIterval(count)},rndTime)
    } else {
        return isRunning = false;
    }
}
async function getBuildFoggy(build,count) {
    isRunning = await setBuildItems(build);
        if(!isRunning){ return console.log('ошибка установки')}
        buildIterval(count);
}
const timerInterval =(trigger)=>{
    let timerId = 0;
     if ('start' === trigger){
         timerId = setInterval(()=>{
             timer--
         },1000)
     };
     if('stop' === trigger){ clearInterval(timerId); };
}

// конвертер глубокого
const tracking = (build,count) => {
    let winInfo = getMainWindow().getElementById('infoWindow');
    if(!isRunning) return
    if(winInfo.style.visibility === 'visible'){
        let textInfo = getMainWindow().querySelector('.infoText').textContent
        if(textInfo.includes('удалось')){
            getMainWindow().querySelector('.infoBtn').click()
            setTimeout(()=>{
                getBuildSpace(build,--count);
            },2000)
        } else if(getMainWindow().getElementById('endtime')){
            let endtime = +getMainWindow().getElementById('endtime').textContent
            if(endtime > timer+20){
                getMainWindow('menu')
                .querySelector('.right img:last-child').click();
            }
            setTimeout(()=>{
                tracking(build,count);
            },5000)
        } else if(textInfo.includes('Идет')) {
            setTimeout(()=>{
                tracking(build,count);
            },5000)
        }
    } else {
        setTimeout(()=>{
        getBuildSpace(build,--count);},5000)
    }
}
async function getBuildSpace(build,count) {
    clearTimeoutAll();
    timerInterval('stop');
    isRunning = await setBuildItems(build);
    if(!isRunning){ return console.log('ошибка установки')}
    await getMainWindow().getElementById('but1').click();
    if(isRunning && 0 < count){
      setTimeout(()=> {
          timer = +getMainWindow().getElementById('endtime').textContent;
          timerInterval('start')
          tracking(build,count)
      },5000)
    }
}



// --- ОБРАБОТЧИК СООБЩЕНИЙ ИЗ POPUP ---
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if(msg.action === 'start') {
        isRunning = true;
        msg.convert === 'foggy' ?
            getBuildFoggy(msg.build,msg.buildCount) :
            tracking(msg.build,msg.buildCount+1);
        timer = +getMainWindow().getElementById('endtime').textContent | 0;
        if(0 < timer) timerInterval('start')
    } else if(msg.action === 'stop') {
        timerInterval('stop')
        isRunning = false;
    }

});