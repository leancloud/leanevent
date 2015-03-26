/**
 * @author wangxiao
 * @date 2015-03-26
 *
 * 每位工程师都有保持代码优雅的义务
 * Each engineer has a duty to keep the code elegant
 */

void function(win) {

    // version
    var VERSION = '1.0.0';

    // AMD support
    if (typeof define === 'function' && define.amd) {
        define('leanEvent', [], function() {
            return leanEvent;
        });
    }

    // namespace leanEvent
    win.leanEvent = function() {
        var eventList = {};
        var eventOnceList = {};

        var _on = function(eventName, fun, isOnce) {
            if (!eventName) {
                throw('No event name.');
            }
            else if (!fun) {
                throw('No callback function.');
            }
            var list = eventName.split(/\s+/);
            var tempList;
            if (!isOnce) {
                tempList = eventList;
            } 
            else {
                tempList = eventOnceList;
            }
            for (var i = 0, l = list.length; i < l; i ++) {
                if (list[i]) {
                    if (!tempList[list[i]]) {
                        tempList[list[i]] = [];
                    }
                    tempList[list[i]].push(fun);
                }
            }
        };
        
        var _off = function(eventName, fun, isOnce) {
            var tempList;
            if (!isOnce) {
                tempList = eventList;
            } else {
                tempList = eventOnceList;
            }
            if (tempList[eventName]) {
                var i = 0;
                var l = tempList[eventName].length;
                for (; i < l; i ++) {
                    if (tempList[eventName][i] === fun) {
                        tempList[eventName][i] = null;
                        // 每次只清除掉一个
                        return;
                    }
                }
            }
        };

        function cleanNull(list) {
            var tempList = [];
            var i = 0;
            var l = list.length;
            if (l) {
                for (; i < l; i ++) {
                    if (list[i]) {
                        tempList.push(list[i]);
                    }
                }
                return tempList;
            } else {
                return null;
            }
        }

        return {
            on: function(eventName, fun) {
                _on(eventName, fun);
                return this;
            },
            once: function(eventName, fun) {
                _on(eventName, fun, true);
                return this;
            },
            emit: function(eventName, data) {
                if (!eventName) {
                    throw('No emit event name.');
                }
                var i = 0;
                var l = 0;
                if (eventList[eventName]) {
                    i = 0;
                    l = eventList[eventName].length;
                    for (; i < l; i ++) {
                        if (eventList[eventName][i]) {
                            eventList[eventName][i].call(this, data);
                        }
                    }
                    cleanNull(eventList[eventName]);
                }
                if (eventOnceList[eventName]) {
                    i = 0;
                    l = eventOnceList[eventName].length;
                    for (; i < l; i ++) {
                        if (eventOnceList[eventName][i]) {
                            eventOnceList[eventName][i].call(this, data);
                            _off(eventName, eventOnceList[eventName][i], true);
                        }
                    }
                    cleanNull(eventOnceList[eventName]);
                }
                return this;
            },
            off: function(eventName, fun) {
                _off(eventName, fun);
                return this;
            }
        };
    };

    win.leanEvent.version = VERSION;

}(window);
