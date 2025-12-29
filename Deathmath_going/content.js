let isRunning = false;
let config = {};
let dubleSector, propusk;
let countTimeuot = 0;
let endQuestTime = config.setTimeEnd ?? 60;
let timeId = 0;

const delayGoing = 3000;
const delayFight = 2000;
const array_blocked = ['http://img.starcombats.com/map/cor/ost00.gif',
    'http://img.starcombats.com/map/cor/ost00s.gif',
    'http://img.starcombats.com/map/cor/ost01.gif',
    'http://img.starcombats.com/map/cor/ost01s.gif',
    'http://img.starcombats.com/map/cor/ost02.gif',
    'http://img.starcombats.com/map/cor/ost02s.gif',
    'http://img.starcombats.com/map/cor/ost03.gif',
    'http://img.starcombats.com/map/cor/ost03s.gif']

function patchConfirmInMainFrame() {
    chrome.runtime.sendMessage({type: "PATCH_CONFIRM"});
}

function getWindow(nameWindow = 'main') {
    return document.getElementsByName(nameWindow + "Window")[0].contentDocument;
}

function injectedScript() {
    try {
        let main = getWindow('main');
        if(!main.getElementById('auto-II')) {
            const script = document.createElement('script');
            script.id = 'auto-II';
            script.src = chrome.runtime.getURL('injected.js');
            main.head.appendChild(script);
        }
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

const clearTimeoutAll =()=>{
    let last_timeout = setTimeout(()=>{},0)
    for(let i = timeId; i <= last_timeout; i++){
        clearTimeout(i)
    }
    timeId = last_timeout;
}

function nextStep() {
    const centGor = config.horizontal,
        centVer = config.vertical;
    let exception = '62559S';

    const main_win = getWindow('main'),
        idSector = main_win.getElementById("sector"),
        polSec = idSector.textContent,
        arrowLeft = main_win.getElementById('left'),
        arrowRight = main_win.getElementById('right'),
        arrowForward = main_win.getElementById('fwd'),
        arrowBack = main_win.getElementById('back');
    const imgObekt = [main_win.getElementById('img_left'),
        main_win.getElementById('img_right'),
        main_win.getElementById('img_front')];
    const front = !array_blocked.includes(imgObekt[2].src),
        right = !array_blocked.includes(imgObekt[1].src),
        left = !array_blocked.includes(imgObekt[0].src);
    let napravlenie = polSec[polSec.length-1],
        gorizont = polSec.slice(polSec.length-3, polSec.length-1),
        vertical = polSec.slice(0, polSec.length-4);


    gorizont = Number(gorizont)
    vertical = Number(vertical)

    const message_window = getWindow('chatbar'),
        otp = message_window.querySelector('.chatbtn'),
        messege = message_window.querySelector('#chatmessage');

    const oblomki = [main_win.querySelector('#obj_left'),
        main_win.querySelector('#obj_front'),
        main_win.querySelector('#obj_right')]
    oblomki.forEach(elem => {
        if(elem.style.display === 'block') {
            if(elem.firstChild.src === 'http://img.starcombats.com/map/obj/box08.gif'
                && config.showConvert) {
                messege.value = idSector.textContent;
                setTimeout(() => {otp.click()}, 5000);
            }
        }
    })
    if(gorizont === centGor && vertical === centVer) {
        console.log(gorizont)
        processing(delayGoing)
        return
    }

    if(!right && !left && !front) {
        console.log('тупик')
        arrowBack.click()
        processing(delayGoing)
        return
    }

    const directions = {
        'N': { frontCond: vertical > centVer, leftCond: gorizont > centGor, rightCond: gorizont < centGor },
        'W': { frontCond: gorizont > centGor, leftCond: vertical < centVer, rightCond: vertical > centVer },
        'S': { frontCond: vertical < centVer, leftCond: gorizont < centGor, rightCond: gorizont > centGor },
        'E': { frontCond: gorizont < centGor, leftCond: vertical > centVer, rightCond: vertical < centVer }
    };

    const dir = directions[napravlenie];

    if (exception === polSec && front) {
        arrowForward.click();
    } else if (dir?.frontCond && front) {
        arrowForward.click();
    } else if (dir?.leftCond && left) {
        arrowLeft.click();
    } else if (dir?.rightCond && right) {
        arrowRight.click();
    } else if (!left && !right && front) {
        arrowForward.click();
    } else if (left) {
        arrowLeft.click();
    } else if (front) {
        arrowForward.click();
    } else {
        arrowRight.click();
    }

   /* switch (napravlenie) {
        case 'N':
            if(vertical > centVer && front || exception === polSec) {
                arrowForward.click()
            } else if(gorizont > centGor && left) {
                arrowLeft.click()
            } else if(gorizont > centVer && !right && front) {
                arrowForward.click()
            } else if(gorizont < centGor && right) {
                arrowRight.click()
            } else if(!left && !right) {
                arrowForward.click()
            } else if(left) {
                arrowLeft.click()
            } else if(front) {
                arrowForward.click()
            } else {
                arrowRight.click()
            }
            break
        case 'W':
            if(gorizont > centGor && front || exception === polSec) {
                arrowForward.click()
            } else if(vertical < centVer && left) {
                arrowLeft.click()
            } else if(vertical > centVer && !right && front) {
                arrowForward.click()
            } else if(vertical > centVer && right) {
                arrowRight.click()
            } else if(!left && !right) {
                arrowForward.click()
            } else if(left) {
                arrowLeft.click()
            } else if(front) {
                arrowForward.click()
            } else {
                arrowRight.click()
            }
            break
        case 'S':
            if(vertical < centVer && front || exception === polSec) {
                arrowForward.click()
            } else if(gorizont < centGor && left) {
                arrowLeft.click()
            } else if(gorizont < centVer && !right && front) {
                arrowForward.click()
            } else if(gorizont > centGor && right) {
                arrowRight.click()
            } else if(!left && !right) {
                arrowForward.click()
            } else if(left) {
                arrowLeft.click()
            } else if(front) {
                arrowForward.click()
            } else {
                arrowRight.click()
            }
            break
        case 'E':
            if(gorizont < centGor && front || exception === polSec) {
                arrowForward.click()
            } else if(vertical > centVer && left) {
                arrowLeft.click()
            } else if(vertical < centVer && !right && front) {
                arrowForward.click()
            } else if(vertical < centVer && right) {
                arrowRight.click()
            } else if(!left && !right) {
                arrowForward.click()
            } else if(left) {
                arrowLeft.click()
            } else if(front) {
                arrowForward.click()
            } else {
                arrowRight.click()
            }
            break
        default:
            break
    }*/
    countTimeuot++
    processing(delayGoing)
}

function processing(delay = 3000) {
    if(!isRunning) return
    if(countTimeuot > 200){
        clearTimeoutAll()
        countTimeuot = 0;
    }
    const interRnd = Math.floor(Math.random() * 1000) + delay;
        setTimeout(()=>{
            const main_win = getWindow('main'),
                idSector = main_win.getElementById("sector"),
                time = Number(new Date().getMinutes());
            if(endQuestTime === time && config.getOut) {
                top.location.href = "/exit.php?1"
                return
            }

            if(null != idSector) {
                if(propusk <= 2) {

                    if(idSector.textContent === dubleSector) {
                        propusk++
                    }
                    nextStep()
                } else {
                    let panelMenu = getWindow('menu');
                    panelMenu.querySelector('.right img:last-child').click()
                    propusk = 0;
                    countTimeuot++
                    processing(delayGoing)
                }
                dubleSector = idSector.textContent;
            } else {
                let panelMenu = getWindow('menu');
                panelMenu.querySelector('.right img:last-child').click()
                propusk = 0;
                countTimeuot++
                processing(delayGoing)
            }
        }, interRnd);
}


chrome.runtime.onMessage.addListener((msg) => {
    if(msg.type === "START") {

        config = {
            vertical: msg.options.vertical,
            horizontal: msg.options.horizontal,
            scorePoints: msg.options.scorePoints,
            showConvert: msg.options.showConvert,
            getOut: msg.options.getOut,
            setTimeEnd: msg.options.setTimeEnd,
        }

        isRunning = true;
        setTimeout(() => processing(delayGoing), 1000);
        console.log(msg.options);
    } else if(msg.type === "STOP") {
        isRunning = false;
    }
});
