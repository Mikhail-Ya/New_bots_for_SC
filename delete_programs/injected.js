(function() {
    if (typeof confirm === 'function') {
        window.confirm = function() {
            return true; // автоматически "ОК"
        };
    }
})()



