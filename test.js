if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * Test runner
 * 
 * @author Joe Cavanagh
 **/
define(['child_process'], function(child_process) {
    var jasmine = child_process.spawn('jasmine-node', ['./spec', '--forceexit']);

    function logToConsole(data) {
        console.log(String(data));
    }

    jasmine.stdout.on('data', logToConsole);
    jasmine.stderr.on('data', logToConsole);
});
