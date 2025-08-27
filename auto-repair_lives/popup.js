
document.getElementById('injectButton').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        if (!tabs.length || !tabs[0]) return console.error('No active tab found');
        const itemName = document.getElementById('item-name').value || "Миниверфь";
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
