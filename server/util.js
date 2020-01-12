var SUCCESS = '[✔]';
var FAIL = '[✖]';

module.exports.logSuccess = function(...strings) {
    console.log(`${SUCCESS} `, ...strings);
}

module.exports.logFail = function(...strings) {
    console.log(`${FAIL} `, ...strings);
}

module.exports.debug = function(variable) {
    console.log('DEBUG: (', typeof variable, ')', variable);
}
