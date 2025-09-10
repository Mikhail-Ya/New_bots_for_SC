
let isRunning = false;
let config = {
    category: 'type1_1',
    targetItem: "Мультистрелок v3.0 CV",
    deleteDelay: 1500
};

function patchConfirmInMainFrame() {
    chrome.runtime.sendMessage({ type: "PATCH_CONFIRM" });
}

function startDeletion(options) {
    config = options;
    isRunning = true;

    const mainWindow = document.getElementsByName('mainWindow')[0]?.contentDocument;
    if (!mainWindow) return;

    const items = Array.from(mainWindow.querySelectorAll(`#${config.category} .item`))
        .filter(item => item.querySelector('h1')?.textContent === config.targetItem);

    if (items.length === 0) {
        console.log('❌ Предметы не найдены');
        return;
    }

    let index = 0;
    function next() {

        if (!isRunning || index >= items.length) return;
        const randomDelay = Math.floor(Math.random() * 300) + config.deleteDelay;
        const item = items[index];
        const deleteBtn = item.querySelector('tr:nth-child(2) td:nth-child(4) img');
        if (deleteBtn) {
                deleteBtn.click();
                index++;
                setTimeout(next, randomDelay);
        } else {
            index++;
            next();
        }
    }
    next();
}

chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "START_DELETE") {
        config = {
            category: msg.category,
            targetItem: msg.targetItem,
            deleteDelay: msg.deleteDelay
        }
        if (!document.getElementById('auto-confirm-script')) {
            const script = document.createElement('script');
            script.id = 'auto-conform-script';
            script.src = chrome.runtime.getURL('injected.js');
            document.getElementsByName('mainWindow')[0].contentDocument
            .head.appendChild(script);
        }
        isRunning = true;
        setTimeout(() => startDeletion(msg.options), 1000);
    } else if (msg.type === "STOP_DELETE") {
        isRunning = false;
    }
});
