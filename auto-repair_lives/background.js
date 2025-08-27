console.log('🚀 background.js запущен');

/*chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    console.log('📩 Получено:', request);

    if (request.action === 'start_delete') {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            console.log('🎯 Вкладка:', tab.id);

            // Внедряем auto-repair.js в mainWindow (frameId: 1)
            console.log('🔄 Инжектируем auto-repair.js...');
            await chrome.scripting.executeScript({
                target: { tabId: tab.id, frameIds: [1] },
                files: ['auto-repair.js']
            });
            console.log('✅ auto-repair.js внедрён');

            // Отправляем команду в mainWindow
            await chrome.tabs.sendMessage(tab.id, { action: 'start_delete', ...request }, { frameId: 1 });

            sendResponse({ status: 'started' });
        } catch (err) {
            console.error('🔴 Ошибка:', err);
            sendResponse({ error: err.message });
        }
        return true;
    }

    if (request.action === 'stop_delete') {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            await chrome.tabs.sendMessage(tab.id, { action: 'stop_delete' }, { frameId: 1 });
            sendResponse({ status: 'stopped' });
        } catch (err) {
            sendResponse({ error: err.message });
        }
        return true;
    }
});*/