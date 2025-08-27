
document.getElementById('injectButton').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        if (!tabs.length || !tabs[0]) return console.error('No active tab found');
        const itemName = document.getElementById('item-name').value;
        const delay = parseInt(document.getElementById('delay').value);
        const count = parseInt(document.getElementById('count').value);
        const minHealth = parseInt(document.getElementById('min-health').value); // приводим к числу
        const maxHealth = parseInt(document.getElementById('max-health').value);

        const messageObg = {
            action: 'inject',
            delay: delay, limit: count, name: itemName,
            minHealth: minHealth, maxHealth: maxHealth
        };
        const tabId = tabs[0].id;
        chrome.tabs.sendMessage(tabId, messageObg);
    });
});

/*const BROWSER = typeof chrome !== 'undefined' ? chrome :
    typeof browser !== 'undefined' ? browser :
        null;

document.addEventListener('DOMContentLoaded', () => {
    const itemNameInput = document.getElementById('itemName');
    const delayInput = document.getElementById('delay');
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const status = document.getElementById('status');

    let isRunning = false;

    if (!BROWSER.storage || !BROWSER.storage.local) {
        status.textContent = 'Ошибка API';
        startBtn.disabled = true;
        return;
    }

    BROWSER.storage.local.get(['itemName', 'delay'], (res) => {
        if (res.itemName) itemNameInput.value = res.itemName;
        if (res.delay) delayInput.value = res.delay;
    });

    itemNameInput.addEventListener('change', () => {
        BROWSER.storage.local.set({ itemName: itemNameInput.value });
    });
    delayInput.addEventListener('change', () => {
        BROWSER.storage.local.set({ delay: parseInt(delayInput.value) || 1500 });
    });

    startBtn.onclick = async () => {
        const itemName = itemNameInput.value.trim();
        const delay = parseInt(delayInput.value) || 1500;

        if (!itemName) {
            status.textContent = 'Введите название';
            return;
        }

        try {
            const [tab] = await BROWSER.tabs.query({ active: true, currentWindow: true });

            // Отправляем сообщение В ФРЕЙМ mainWindow (frameId: 1)
            await BROWSER.tabs.sendMessage(tab.id, { action: 'start_delete', itemName, delay }, { frameId: 1 });

            status.textContent = 'Работает...';
            startBtn.disabled = true;
            stopBtn.disabled = false;
        } catch (err) {
            status.textContent = 'Ошибка связи';
            console.error('SendMessage error:', err);
        }
    };

    stopBtn.onclick = async () => {
        if (!isRunning) return;

        try {
            const [tab] = await BROWSER.tabs.query({ active: true, currentWindow: true });
            await BROWSER.tabs.sendMessage(tab.id, { action: 'stop_delete' });
            status.textContent = 'Остановлено';
            resetButtons();
        } catch (err) {
            status.textContent = 'Ошибка';
            console.error(err);
        }
    };

    function resetButtons() {
        startBtn.disabled = false;
        stopBtn.disabled = true;
        isRunning = false;
    }
});*/