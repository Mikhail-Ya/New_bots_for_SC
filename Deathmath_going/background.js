
let isRunning = false;
chrome.runtime.onInstalled.addListener(() => {
    console.log("Auto Delete установлен");
});

chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
    if (msg.type === "GET_STATUS") {
        sendResponse({ isRunning });
    } else if (msg.type === "START_DELETE") {
        isRunning = true;
        chrome.tabs.sendMessage(sender.tab.id, msg);
    } else if (msg.type === "STOP_DELETE") {
        isRunning = false;
        chrome.tabs.sendMessage(sender.tab.id, msg);
    } else if (msg.type === "PATCH_CONFIRM") {
        try {
            await chrome.scripting.executeScript({
                target: { tabId: sender.tab.id, allFrames: true },
                func: () => {
                    if (typeof window.original_confirm === 'undefined') {
                        window.original_confirm = window.confirm;
                    }
                    window.confirm = () => {
                        console.log('✅ [AUTO] confirm → true');
                        return true;
                    };
                }
            });
            console.log('✅ confirm заменён');
        } catch (e) {
            console.error('❌ executeScript failed:', e);
        }
    }
    return true;
});
        