var assert = require('assert');

const Webqueue = require('../modules/webqueue.js')
const Webpage = require('../modules/webpage.js')


describe('Webpage', function() {

    let webpage = new Webpage("https://www.google.com/?s=abcd")

    describe('getOrigin()', function() {
        it('should return origin of website url', function() {
            assert.equal(webpage.getOrigin(), "https://www.google.com");
        });
    });

    webpage = new Webpage("https://www.google.com")

    describe('compare()', function() {
        it('should return true, when domains are same', function() {
            assert.equal(webpage.compare("https://www.Google.com/"), true);
        });
    });


});