var assert = require('assert');
var leanEvent = require('../leanEvent');

var ee;
beforeEach(function(){
    ee = leanEvent();
});

describe('leanEvent', function(){
    describe('#on()', function(){
        it('should invoke handler', function(){
            var invoked = 0;
            ee.on('alpha', function(){
                invoked += 1;
            });
            ee.emit('alpha');
            assert.equal(1, invoked);
        });

        it('shoule invoke handler with argument', function(){
            var invoked = 0;
            ee.on('alpha', function(a){
                invoked += a;
            });
            ee.emit('alpha', 3);
            assert.equal(3, invoked);
        });

        it('should invoke handler with var-length arguments', function(){
            var invoked = 0;
            ee.on('alpha', function(){
                for (var i=0; i<arguments.length; i++) {
                    invoked += arguments[i];
                }
            });
            ee.emit('alpha', 1, 2, 3, 4);
            assert.equal(10, invoked);
        });

        it('should invoke multiple handlers', function(){
            var invoked = 0;
            ee.on('alpha', function(){
                invoked += 1;
            });
            ee.on('alpha', function(){
                invoked += 2;
            });
            ee.emit('alpha');
            assert.equal(3, invoked);
        });

        it('should be called for multiple times', function(){
            var invoked = 0;
            ee.on('alpha', function(){
                invoked += 1;
            });
            ee.emit('alpha');
            ee.emit('alpha');
            assert.equal(2, invoked);
        });

        it('can bind same handler multiple times', function(){
            var invoked = 0;
            var inc = function(){
                invoked += 1;
            };
            ee.on('alpha', inc);
            ee.on('alpha', inc);
            ee.emit('alpha');
            assert.equal(2, invoked);
        });
    });

    describe('#once', function(){
        it('should be called only once for that event', function(){
            var invoked = 0;
            ee.once('beta', function(){
                invoked += 1;
            });
            ee.emit('beta');
            ee.emit('beta');
            assert.equal(1, invoked);
        });

        it('can be called if we bind the event again', function(){
            var invoked = 0;
            var inc = function(){
                invoked += 1;
                ee.once('beta', inc);
            };
            ee.once('beta', inc);
            ee.emit('beta').emit('beta').emit('beta');
            assert.equal(3, invoked);
        });
    });

    describe('#off', function(){
        it('can turn off handler a handler by reference', function(){
            var invoked = 0;
            var inc = function(){
                invoked += 1;
            };

            ee.on('charlie', inc);
            ee.emit('charlie');
            ee.off('charlie', inc);
            ee.emit('charlie');

            assert.equal(1, invoked);
        });

        it('can turn off sibling handler in handler', function(){
            var invoked = 0;
            var inc = function(){
                invoked += 1;
                ee.off('charlie', inc2);
            };
            var inc2 = function(){
                invoked += 2;
            };

            ee.on('charlie', inc);
            ee.on('charlie', inc2);

            ee.emit('charlie');
            ee.emit('charlie');

            assert(invoked >= 2 && invoked <= 4);
        });

        it('can turn off a handler which is never registered', function(){
            var inc = function() {};
            ee.off('charlie', inc);
        });

        it('can bind a handler twice and remove just once', function(){
            var invoked = 0;
            var inc = function(){
                invoked += 1;
            };
            ee.on('charlie', inc);
            ee.on('charlie', inc);
            ee.emit('charlie');
            ee.off('charlie', inc);
            ee.emit('charlie');

            assert.equal(3, invoked);
        });
    });
});
