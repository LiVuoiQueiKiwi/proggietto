const DEBUG_ON = 1;

var SUCCESS = '[✔]';
var FAIL = '[✖]';

module.exports = {
    logSuccess: function(...strings) {
        console.log(`${SUCCESS} `, ...strings);
    },

    logFail: function(...strings) {
        console.log(`${FAIL} `, ...strings);
    },

    debug: function(...variables) {
        variables.forEach(function(item) {
            console.log('DEBUG: (', typeof item, ')', item);
        });
    },

    terminal: function(string) {
        if (DEBUG_ON) {
            var now = new Date();
            timestamp = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
            console.log(`[${timestamp}]  ${string}`);
        }
    },

    getDistance: function(origin, destination) {
        // return distance in meters

        var lon1 = toRadian(OLC_Coords(origin).lng),
            lat1 = toRadian(OLC_Coords(origin).lat),
            lon2 = toRadian(OLC_Coords(destination).lng),
            lat2 = toRadian(OLC_Coords(destination).lat);

        var deltaLat = lat2 - lat1;
        var deltaLon = lon2 - lon1;

        var a = Math.pow(Math.sin(deltaLat/2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon/2), 2);
        var c = 2 * Math.asin(Math.sqrt(a));
        const EARTH_RADIUS = 6371;
        return c * EARTH_RADIUS * 1000;
    },

    /**
     * Gestisce la reject() di una Promise.
     */
    handlePromiseRejection: function(error) {
        this.logFail(error);
    }
