
document.addEventListener("DOMContentLoaded", () => {
    const targetItemInput = document.getElementById("targetItem");
    const selectedItem = document.getElementById('select_box');
    const deleteDelayInput = document.getElementById("deleteDelay");
    const startBtn = document.getElementById("startBtn");
    const stopBtn = document.getElementById("stopBtn");
    const status = document.getElementById("status");

    chrome.storage.local.get({targetItem:"Мультистрелок v3.0 CV",deleteDelay:1500}, res => {
        targetItemInput.value = res.targetItem;
        deleteDelayInput.value = res.deleteDelay;
    });

    targetItemInput.addEventListener("change", () => {
        chrome.storage.local.set({ targetItem: targetItemInput.value });
    });
    deleteDelayInput.addEventListener("change", () => {
        chrome.storage.local.set({ deleteDelay: parseInt(deleteDelayInput.value) });
    });

    chrome.runtime.sendMessage({type:"GET_STATUS"}, res => {
        status.textContent = res?.isRunning ? "Состояние: работает" : "Состояние: ожидание";
        status.style.color = res?.isRunning ? "green" : "#555";
    });

    startBtn.addEventListener("click", () => {
        const options = {
            category: selectedItem.value,
            targetItem: targetItemInput.value,
            deleteDelay: parseInt(deleteDelayInput.value)
        };
        chrome.storage.local.set(options, () => {
            chrome.tabs.query({active:true,currentWindow:true}, tabs => {
                chrome.tabs.sendMessage(tabs[0].id, {type:"START_DELETE", options});
            });
        });
        status.textContent = "Состояние: работает";
        status.style.color = "green";
    });

    stopBtn.addEventListener("click", () => {
        chrome.tabs.query({active:true,currentWindow:true}, tabs => {
            chrome.tabs.sendMessage(tabs[0].id, {type:"STOP_DELETE"});
        });
        status.textContent = "Состояние: ожидание";
        status.style.color = "#555";
    });
});
        