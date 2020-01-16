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
