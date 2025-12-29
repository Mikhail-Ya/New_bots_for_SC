
document.addEventListener("DOMContentLoaded", () => {
    const selectedQuest = document.getElementById('select_box');
    const checkSecurity = document.getElementById("checkSecurity");
    const passage = document.getElementById("checkPassage");
    const limitItems = document.getElementById("limitItems");
    const startBtn = document.getElementById("startBtn");
    const stopBtn = document.getElementById("stopBtn");

    startBtn.addEventListener("click", () => {
        const options = {
            numberQuest: selectedQuest.value,
            security: checkSecurity.checked,
            passage: passage.checked,
            limitItems: parseInt(limitItems.value)
        };
        chrome.storage.local.set(options, () => {
            chrome.tabs.query({active:true,currentWindow:true}, tabs => {
                chrome.tabs.sendMessage(tabs[0].id, {type:"START_MISSION", options});
            });
        });
    });

    stopBtn.addEventListener("click", () => {
        chrome.tabs.query({active:true,currentWindow:true}, tabs => {
            chrome.tabs.sendMessage(tabs[0].id, {type:"STOP_MISSION"});
        });
    });
});
document.getElementById('startBtn').addEventListener('click', async () => {
    const resultEl = document.getElementById('result');
    resultEl.value = '⏳ Распознаю...';
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        console.log('🔍 Нашли вкладку:', tabs[0]);

        if (!tabs[0]) {
            console.error('❌ Вкладка не найдена');
            return;
        }

        chrome.tabs.sendMessage(tabs[0].id, { action: 'getCaptchaUrl' }, (response) => {
            console.log('📩 Ответ от content.js:', response);

            if (chrome.runtime.lastError) {
                console.error('❌ Ошибка при отправке:', chrome.runtime.lastError);
            }
        });
    });
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tabId = tabs[0].id;

        chrome.tabs.sendMessage(tabId, { action: 'getCaptchaUrl' }, (response) => {
            if (chrome.runtime.lastError) {
                console.error('Ошибка content.js:', chrome.runtime.lastError);
                resultEl.value = '❌ Ошибка связи с вкладкой';
                return;
            }

            if (response && response.url) {
                // ✅ Исправлено: chrome.extension.sendMessage
                chrome.extension.sendMessage(
                    { action: 'recognizeCaptcha', imageUrl: response.url },
                    (result) => {
                        if (chrome.runtime.lastError) {
                            console.error('Ошибка background:', chrome.runtime.lastError);
                            resultEl.value = '❌ Ошибка фона';
                            return;
                        }

                        if (result.success) {
                            resultEl.value = result.text;
                        } else {
                            resultEl.value = '❌ Ошибка: ' + result.error;
                        }
                    }
                );
            } else {
                resultEl.value = '❌ Капча не найдена';
            }
        });
    });
});