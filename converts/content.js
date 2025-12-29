// --- ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ---
let isRunning = false;
let timeId = 0;
let timer = 0;
// --- ОБРАБОТЧИК СООБЩЕНИЙ ИЗ POPUP ---
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if(msg.action === 'start') {
        isRunning = true;
        msg.convert === 'foggy' ?
            getBuildFoggy(msg.build,msg.buildCount) :
            tracking(msg.build,msg.buildCount);

    } else if(msg.action === 'stop') {
        isRunning = false;
    }

});
const getMainWindow =(name = 'main')=> document.getElementsByName(name + "Window")[0].contentDocument

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
const timerInterval =()=>{
    setInterval(()=>{
        timer--
    },1000)
}
// конвертер глубокого
const tracking = (build,count) => {
    let winInfo = getMainWindow().getElementById('infoWindow');
    if(winInfo.style.visibility === 'visible'){
        let textInfo = getMainWindow().querySelector('.infoText').textContent
        if(textInfo.includes('удалось') && isRunning){
            getMainWindow().querySelector('.infoBtn').click()
            setTimeout(()=>{
                getBuildSpace(build,--count);
            },2000)
        } else if(getMainWindow().getElementById('endTime')){
            let endtime = +getMainWindow().getElementById('endTime').textContent
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
        getBuildSpace(build,count);},5000)
    }
}

async function getBuildSpace(build,count) {
    clearTimeoutAll();
    isRunning = await setBuildItems(build);
    if(!isRunning){ return console.log('ошибка установки')}
    await getMainWindow().getElementById('but1').click();
    if(isRunning && 0 < count){
      setTimeout(()=> {
          timer = +getMainWindow().getElementById('endtime').textContent;
          timerInterval()
          tracking(build,count)
      },4000)
    }
}