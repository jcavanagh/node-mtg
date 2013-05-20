if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * Tests for Config.js
 * 
 * @author Joe Cavanagh
 **/
define(['common/Config'], function(config) {
    describe('Config', function() {
        beforeEach(function() {
            //Mock in test data
            config.config = {
                test1: 'test1'
                ,test2: {
                    test3: 'test3'
                }
            }
        })

        it('should retrieve valid keys', function() {
            var test1 = config.get('test1')
                ,test3 = config.get('test2.test3');

            expect(test1).toBe('test1');
            expect(test3).toBe('test3');
        });

        it('should not crash on invalid keys', function() {
            //Garbage keys
            config.get('ashjldkjflahljnlajns');
            config.get(null);
            config.get(-1);
            config.get('dlnevn.asdnknd.asddvasd');

            //If we got here, we're good
            expect(true).toBe(true);
        });
    }); 
});
