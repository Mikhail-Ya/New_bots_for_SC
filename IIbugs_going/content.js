// --- ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ---
let isRunning = false;
let currentSettings = {
    toPut: [[1, 3], [5, 3], [7, 3], [8, 3], [9, 3]],
    bugsLvlAndComplects: [[1, 1], [5, 2], [7, 3], [8, 4], [9, 5]], // по умолчанию
    complect: true,
    downup: true,
    nonAbils: false,
    doptime: 50
};

// --- ОБРАБОТЧИК СООБЩЕНИЙ ИЗ POPUP ---
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if(msg.action === 'start') {
        isRunning = true;
        currentSettings = {
            toPut: Array.isArray(msg.toPut)
                ? Object.fromEntries(msg.toPut)
                : +msg.toPut,
            bugsLvlAndComplects: Array.isArray(msg.bugsLvlAndComplects)
                ? Object.fromEntries(msg.bugsLvlAndComplects)
                : msg.bugsLvlAndComplects,
            complect: msg.complect ?? true,
            downup: msg.downup ?? true,
            nonAbils: msg.nonAbils ?? false,
            doptime: msg.doptime ?? 50,
            abils: msg.abils,
        };

        msg.point === '0' ? startOneIskIn() : startManyIskIn();

    } else if(msg.action === 'stop') {
        isRunning = false;
    } else if(msg.action === 'updateSettings') {
        currentSettings = {...currentSettings, ...msg.settings};
        console.log('Настройки обновлены:', currentSettings);
    }

});


const getMainWindow = () => document.getElementsByName("mainWindow")[0].contentDocument

const getIskInEnergy = () => {
    return getMainWindow().getElementById("Venergytext")
    .textContent.split("/")
    .map(Number)
}

const getNumberInRace = () => {
    return Number(getMainWindow().getElementById('total_req').textContent)
}

const injectedScript = () => {
    try {
        let main = getMainWindow();
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

// --- ОБРАБОТКА ОДНОГО ЖУКА ---
function startOneIskIn() {
    let main;
    let toPut = +currentSettings.toPut,
        bugComplect = currentSettings.bugsLvlAndComplects,
        complect = currentSettings.complect,
        downup = currentSettings.downup,
        nonAbils = currentSettings.nonAbils;

    let [abil50, abil100, abil200, abilKr, abilEkr] = currentSettings.abils.map(e => Number(e));

    const obnovScript = () => {
        if(!isRunning) return;
        main = getMainWindow()
        if(injectedScript()) {
            setTimeout(() => {
                resetMain()
            }, 2500)
        } else {
            setTimeout(obnovScript, 5500)
        }
    }

    const iskEnerg = () => {
        return new Promise((resolve) => {
            main = getMainWindow()
            main.getElementById('reload').click()
            setTimeout(() => {
                main = getMainWindow();
                let enkaIsk = Number(main.getElementById('Venergy').getAttribute('width'))
                enkaIsk > 200 ? resolve(true) : resolve(false)
            }, 1220)
        })
    }

    const iskRun = () => {
        return new Promise((resolve) => {
            main = getMainWindow();
            let kol = main.getElementById('total_req').textContent
            kol = Number(kol)
            let podatKnop = main.getElementById('start_but')
            let podatString = podatKnop.textContent
            if(kol >= toPut && downup || !downup && kol === toPut) {
                if(podatString === 'Подать заявку') {
                    let plugins = Array.from(main.querySelectorAll('.viod img'))
                    .map(e => e.src).includes('http://img.starcombats.com/programs/void.gif');
                    if(complect && plugins) {
                        main.querySelector('#new_complects li:nth-child(' + bugComplect + ')').click();
                        setTimeout(() => {
                            resolve(true)
                        }, 1522)
                    } else {
                        setTimeout(() => {
                            main.getElementById('reload').click()
                            main = getMainWindow()
                            resolve(true)
                        }, 1245)
                    }
                } else {
                    resolve(false)
                }
            } else {
                resolve(false)
            }
        })
    }

    const energHil = () => {
        return new Promise((resolve) => {
            main = getMainWindow();
            let energy = getIskInEnergy().reduce((a, b) => b - a);
            let proc = getIskInEnergy()[1] * 0.1;
            setTimeout(() => {
                if(energy - proc <= 50 && 0 < abil50) {
                    main.getElementById('img16').click()
                    abil50--
                } else if(energy - proc <= 100 && 0 < abil100) {
                    main.getElementById('img17').click()
                    abil100--
                } else if(0 < abil200) {
                    main.getElementById('img18').click()
                    abil200--
                } else if(abilKr > 0) {
                    main.getElementById('scroll_365').click()
                    abilKr--
                } else if(abilEkr > 0) {
                    main.getElementById('scroll_586').click()
                    abilEkr--
                } else if(nonAbils) {
                }
                setTimeout(resolve, 500)

            }, 1654)
        })
    }

    async function resetMain() {
        main = getMainWindow();
        if(!isRunning) return;
        if(main.getElementById('reload')) {
            await main.getElementById('reload').click()
            let result = await iskRun()
            if(result) {
                let energ = await iskEnerg()
                if(energ) {
                    let kol = getNumberInRace()
                    if(kol >= toPut && downup || !downup && kol === toPut) {
                        let podatKnop = main.getElementById('start_but')
                        let podatString = podatKnop.textContent
                        if(podatString === 'Подать заявку') {
                            await main.getElementById('start_but').click()
                        }
                    }
                    obnovScript()
                } else {
                    await energHil()
                    resetMain()
                }
            } else {
                obnovScript()
            }
        } else {
            obnovScript()
        }
    }

    obnovScript()
}

// --- ОБРАБОТКА ДО 5 ЖУКОВ С ПЕРЕКЛЮЧЕНИЯМИ ---
function startManyIskIn() {
    let main;
    let trigger = false,
        toPut = currentSettings.toPut,
        bugsComplect = currentSettings.bugsLvlAndComplects,
        complect = currentSettings.complect,
        downup = currentSettings.downup,
        nonAbils = currentSettings.nonAbils;

    let [abil50, abil100, abil200,
        abilKr, abilEkr] = currentSettings.abils.map(e => Number(e));

    const proverka = () => {

        let complects = main.getElementById("new_complects");
        let timeRnd = Math.floor(Math.random() * 500);
        let urovIsk = "";
        main = getMainWindow();

        let provEnki = (plugins) => {
            if(plugins) {
                main = getMainWindow()
                let energy = getIskInEnergy().reduce((a, b) => a / b);
                main.getElementById("iskinButtonII").click();
                if(!injectedScript())
                    if(0.9 <= energy) {
                        setTimeout(() => {
                            main = getMainWindow();
                            let kol = main.getElementById("total_req").textContent;
                            let urovIs = Number(main.getElementById("iskin_level").textContent);
                            if("3" === kol || (iskDup.includes(urovIs) && "2" === kol)) {
                                main.getElementById("start_but").click();
                                zapiska[urovIsk]++;
                            }
                        }, 500);
                        setTimeout(dannye, 1000 + timeRnd);
                    } else {
                        main = document.getElementsByName("mainWindow")[0].contentDocument;
                        let kol = getNumberInRace();
                        let urovIs = Number(main.getElementById("iskin_level").textContent);
                        if(3 === kol || (iskDup.includes(urovIs) && 2 == kol)) {
                            let energy = main
                            .getElementById("Venergytext")
                            .textContent.split("/")
                            .map(Number)
                            .reduce((a, b) => b - a);
                            let proc =
                                main
                                .getElementById("Venergytext")
                                .textContent.split("/")
                                .map(Number)[1] * 0.1;
                            if(energy - proc <= 50 && abi_50 < 80) {
                                abi_50++;
                                main.getElementById("img16").click();
                            } else if(energy - proc <= 100 && abi_100 < 130) {
                                abi_100++;
                                main.getElementById("img17").click();
                            } else if(abi_200 <= 80) {
                                abi_200++;
                                main.getElementById("img18").click();
                            } else if(abilkaGos > 0) {
                                abilkaGos--;
                                main.getElementById("scroll_365").click();
                            } else if(abilkaEkr > 0) {
                                abilkaEkr--;
                                main.getElementById("scroll_586").click();
                            }
                            setTimeout(() => {
                                main.getElementById("start_but").click();
                                zapiska[urovIsk]++;
                            }, 400);
                        }
                        setTimeout(dannye, 800 + timeRnd);
                    }
            }
        };
        let checkPlugins = () => {
            setTimeout(() => {
                let plugins = Array.from(main.querySelectorAll('.viod img'))
                .map(e => e.src).includes('http://img.starcombats.com/programs/void.gif');
                if(!plugins && complect[urovIsk] === "0") {
                    proverka(true);
                } else {
                    provEnki(plugins);
                }
            }, 200);
        };

        if(main.getElementById("iskin_level")) {
            urovIsk = main.getElementById("iskin_level").textContent;
        }

        if(Object.keys(complect).includes(urovIsk)) {
            complects.querySelector("li:nth-child(" + complect[urovIsk] + ")").click();
            setTimeout(checkPlugins, 2500 + timeRnd);
        } else {
            setTimeout(() => {
                provEnki(true);
            }, 2000 + timeRnd);
        }

    };
}
