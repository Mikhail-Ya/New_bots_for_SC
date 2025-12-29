
let worker;

async function initTesseract() {
    if (!worker) {
        worker = createWorker({
            workerPath: chrome.extension.getURL('worker.min.js'),
            corePath: chrome.extension.getURL('tesseract.min.js'),
            logger: m => console.log('[Tesseract]', m)
        });

        await worker.load();
        await worker.loadLanguage('eng');
        await worker.initialize('eng');
        console.log('✅ Tesseract готов в background.js');
    }
}

console.log('✅ background.js загружен');

// ✅ Исправлено: chrome.extension.onMessage
chrome.extension.onMessage.addListener(async (request, sender, sendResponse) => {
    console.log('📩 background получил:', request);

    if (request.action === 'recognizeCaptcha') {
        try {
            // Пока для теста:
            sendResponse({ success: true, text: "ТЕСТ ИЗ BACKGROUND" });
            return true; // для асинхронного ответа
        } catch (err) {
            sendResponse({ success: false, error: err.message });
            return true;
        }
    }
});