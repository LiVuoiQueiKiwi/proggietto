const DEBUG_ON = 1;

var SUCCESS = '[✔]';
var FAIL = '[✖]';

module.exports.logSuccess = function(...strings) {
    console.log(`${SUCCESS} `, ...strings);
}

module.exports.logFail = function(...strings) {
    console.log(`${FAIL} `, ...strings);
}

module.exports.debug = function(...variables) {
    variables.forEach(function(item) {
        console.log('DEBUG: (', typeof item, ')', item);
    });
}

module.exports.terminal = function(string) {
    if (DEBUG_ON) {
        var now = new Date();
        timestamp = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
        console.log(`[${timestamp}]  ${string}`);
    }
}
