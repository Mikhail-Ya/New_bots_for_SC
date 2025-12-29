
document.addEventListener("DOMContentLoaded", () => {
    const vertical = document.getElementById("vertiсal");
    const horizontal = document.getElementById("horizontal");
    const scorePoints = document.getElementById("scorePoints");
    const showConvert = document.getElementById("showConvert");
    const getOut = document.getElementById("getOut");
    const timeEnd = document.getElementById("timeEnd");
    const stopBtn = document.getElementById("stopBtn");
    const status = document.getElementById("status");

    /**chrome.storage.local.get({targetItem:"Мультистрелок v3.0 CV",deleteDelay:1500}, res => {
        targetItemInput.value = res.targetItem;
        deleteDelayInput.value = res.deleteDelay;
    });

    targetItemInput.addEventListener("change", () => {
        chrome.storage.local.set({ targetItem: targetItemInput.value });
    });
    deleteDelayInput.addEventListener("change", () => {
        chrome.storage.local.set({ deleteDelay: parseInt(deleteDelayInput.value) });
    });*/

    chrome.runtime.sendMessage({type:"GET_STATUS"}, res => {
        status.textContent = res?.isRunning ? "Состояние: работает" : "Состояние: ожидание";
        status.style.color = res?.isRunning ? "green" : "#555";
    });

    startBtn.addEventListener("click", () => {
        const options = {
            vertical: vertical.value ?? 5,
            horizontal: horizontal.value ?? 55,
            scorePoints: scorePoints.checked ?? false,
            showConvert: showConvert.checked ?? true,
            getOut: getOut.checked ?? false,
            setTimeEnd: timeEnd.value ?? 60
        };
        chrome.storage.local.set(options, () => {
            chrome.tabs.query({active:true,currentWindow:true}, tabs => {
                chrome.tabs.sendMessage(tabs[0].id, {type:"START", options});
            });
        });
        status.textContent = "Состояние: работает";
        status.style.color = "green";
    });

    stopBtn.addEventListener("click", () => {
        chrome.tabs.query({active:true,currentWindow:true}, tabs => {
            chrome.tabs.sendMessage(tabs[0].id, {type:"STOP"});
        });
        status.textContent = "Состояние: ожидание";
        status.style.color = "#555";
    });
});
        