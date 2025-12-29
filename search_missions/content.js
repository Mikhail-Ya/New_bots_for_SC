
let isRunning = false;
let config = {
    numberQuest: 1,
    security: true,
    passage: false,
    limitItems:5
};
console.log('✅ content.js загружен');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('📩 Получено сообщение в content.js:', request);

    if (request.action === 'getCaptchaUrl') {
        const img = document.querySelector('img[src*="captchas_code.php"]');
        if (img) {
            sendResponse({ url: img.src });
        } else {
            sendResponse({ url: null });
        }
        return true; // обязательно!
    }
});


function patchConfirmInMainFrame() {
    if (!document.getElementById('auto-confirm-script')) {
        const script = document.createElement('script');
        script.id = 'auto-conform-script';
        script.src = chrome.runtime.getURL('injected.js');
        document.getElementsByName('mainWindow')[0].contentDocument
        .head.appendChild(script);
    }
}

function startDeletion(options) {
    config = options;
    const mainWindow =()=> document.getElementsByName('mainWindow')[0]?.contentDocument;
    const menuWindow =()=> document.getElementsByName('menuWindow')[0]?.contentDocument;
    let main = mainWindow()
    let imgSrc = main.querySelector("#special_item img")
    recognizeTextOnPage(imgSrc)

}

chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "START_MISSION") {
        isRunning = true;
        console.log('start_mission')
        setTimeout(() => startDeletion(msg.options), 1000);
    } else if (msg.type === "STOP_MISSION") {
        isRunning = false;
    }
});
// Основная функция распознавания
async function recognizeTextOnPage(elementSrc) {
    // Слушаем запрос от popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'getCaptchaUrl') {
            const img = elementSrc;
            if (img) {
                sendResponse({ url: img.src });
            } else {
                sendResponse({ url: null });
            }
            return true; // для асинхронного ответа
        }
        console.log('mission')
    });
}