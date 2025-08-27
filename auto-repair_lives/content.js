chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'inject') {
        const {name, delay, limit, maxHealth, minHealth} = message
        if (!document.getElementById('auto-repair-script')) {
            const script = document.createElement('script');
            script.id = 'auto-repair-script';
            script.src = chrome.runtime.getURL('auto-repair.js');
            document.getElementsByName('mainWindow')[0].contentDocument
            .head.appendChild(script);
        }
        setTimeout(()=>{
            autoRepair(name, delay, limit, minHealth, maxHealth)
        },1000);
        sendResponse({status: 'success'});
    }
});
function autoRepair (name, delay, limit, minHealth, maxHealth) {
    const getMainWindow = () => document.getElementsByName('mainWindow')[0].contentDocument;
    const getMenuWindow = () => document.getElementsByName('menuWindow')[0].contentDocument;
    const randTime = ()=> Math.floor(Math.random()*500+delay);
    const changeKit = () => {
      let mainWin = getMainWindow();
        let allKits = mainWin.querySelectorAll('#complnames tr');
        allKits[minHealth-1].querySelector('a').click()
        setTimeout(()=>{
            allKits[maxHealth-1].querySelector('a').click()
            getProgramsList()
        },randTime()+1000)
    }
    const getItemsArray = () => {
        let mainWin = getMainWindow();
        const items = Array.from(mainWin.querySelectorAll('#type2_3 .item'))
        .filter(el => {
            const title = el.querySelector('h1');
            return title && title.textContent.trim() === name;
        });
        if (items.length === 0) {return}
        return items;
    }
    function startAutoRepair() {
            let main = document.getElementsByName('mainWindow')[0].contentDocument;
            let menu = getMenuWindow();
            let items = getItemsArray();
            let hpPers = menu.querySelector('#hptext').textContent.split('/').map(Number).reduce((a,b)=>b - a)
            let item = items[items.length - 1]
            let usesItem = (item.querySelector('.item_info h2').textContent).match(/[0-9]/gi);
            let uses = usesItem[1] - usesItem[0];

            if (uses <= 0) {
                items.pop()
                startAutoRepair()
            }
            if(main.querySelector('#infoWindow').style.visibility === 'visible') {
                healphy = Number(main.querySelector('#infoWindowMessage')?.textContent.match(/\d/g)?.join(''))
                hpPers -= healphy | 0
            }
            if ((hpPers - healphy) > 0 && uses >= 1 && 0 < limit) {
                item.querySelector('tr:nth-of-type(2) td:nth-of-type(2) img').click()

                setTimeout(()=>{
                    main = getMainWindow();
                    main.querySelector('.pr_btn1').click()
                    --limit
                    setTimeout(()=>{startAutoRepair()},randTime());
                },1000)

            } else { changeKit() }
    }

    const getProgramsList =()=>{
        let main = getMainWindow();
        let programsList = main.querySelector('.cats a:nth-of-type(2)')
        setTimeout(()=>{
            programsList.click()
            setTimeout(()=>{
                main = getMainWindow();
                main.querySelector('#group2 table:nth-of-type(3) a').click();
                setTimeout(startAutoRepair,randTime());
            },randTime()+1000)
        }, randTime()+1000)
    }
    changeKit();
}
