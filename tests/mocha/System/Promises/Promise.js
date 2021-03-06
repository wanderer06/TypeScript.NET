"use strict";
var Promise_1 = require("../../../../dist/commonjs/System/Promises/Promise");
var AU = require("../../../../dist/commonjs/System/Collections/Array/Utility");
var Stopwatch_1 = require("../../../../dist/commonjs/System/Diagnostics/Stopwatch");
var defer_1 = require("../../../../dist/commonjs/System/Threading/defer");
var LazyPromise_1 = require("../../../../dist/commonjs/System/Promises/LazyPromise");
var ObjectDisposedException_1 = require("../../../../dist/commonjs/System/Disposable/ObjectDisposedException");
var Promise_2 = require("../../../../source/System/Promises/Promise");
var assert = require("assert");
var REASON = "this is not an error, but it might show up in the console";
var calledAsFunctionThis = (function () { return this; }());
afterEach(function () {
});
describe("computing sum of integers using promises", function () {
    var count = 1000;
    var array = AU.range(1, count);
    var swA = Stopwatch_1.default.startNew();
    var answer = array.reduce(function (currentVal, nextVal) { return currentVal + nextVal; }, 0);
    swA.stop();
    it("should compute correct result without blowing stack (Synchronous) (lambda only)", function () {
        var sw = Stopwatch_1.default.startNew();
        return array
            .reduce(function (promise, nextVal) {
            return promise.thenSynchronous(function (currentVal) { return currentVal + nextVal; });
        }, Promise_1.Promise.resolve(0))
            .thenSynchronous(function (value) {
            sw.stop();
            assert.equal(value, answer);
        });
    });
    it("should compute correct result without blowing stack (Synchronous) (lambda only)", function () {
        var source = new Promise_2.PromiseCollection(array.map(function (v) { return new Promise_2.Fulfilled(v); }));
        var sw = Stopwatch_1.default.startNew();
        return source
            .reduce(function (previousValue, currentValue) { return previousValue + currentValue; }, 0)
            .then(function (value) {
            sw.stop();
            assert.equal(value, answer);
        });
    });
    it("should compute correct result without blowing stack (lambda only)", function () {
        var sw = Stopwatch_1.default.startNew();
        return array
            .reduce(function (promise, nextVal) {
            return promise.then(function (currentVal) { return currentVal + nextVal; });
        }, Promise_1.Promise.resolve(0))
            .then(function (value) {
            sw.stop();
            assert.equal(value, answer);
        });
    });
    it("should be deferring fulfillment", function () {
        var wasRun = false;
        var r = Promise_1.Promise.resolve(true).then(function () {
            wasRun = true;
        });
        assert.ok(!wasRun, "The promise should have deferred until after closure completed.");
        return r;
    });
});
describe("Resolution and Rejection", function () {
    it("should result in a fulfilled promise when given a value", function () {
        var f = Promise_1.Promise.resolve(5);
        assert.equal(f.result, 5);
        assert.equal(f.isSettled, true);
        assert.equal(f.isFulfilled, true);
        assert.equal(f.isRejected, false);
    });
    it("should result in a rejected promise when requesting rejected", function () {
        var f = Promise_1.Promise.reject("err");
        assert.equal(f.error, "err");
        assert.equal(f.isSettled, true);
        assert.equal(f.isFulfilled, false);
        assert.equal(f.isRejected, true);
    });
    it("resolves multiple observers", function (done) {
        var nextTurn = false;
        var resolution = "Ta-ram pam param!";
        var pending = new Promise_1.Promise();
        var count = 10;
        var i = 0;
        function resolve(value) {
            i++;
            assert.equal(value, resolution);
            assert.ok(nextTurn);
            if (!nextTurn)
                i = count;
            if (i === count) {
                done();
            }
        }
        while (++i <= count) {
            pending.then(resolve);
        }
        pending.resolve(resolution);
        i = 0;
        nextTurn = true;
    });
    it("observers called even after throw (synchronous)", function () {
        var threw = false;
        var pending = new Promise_1.Promise();
        pending.thenSynchronous(function () {
            threw = true;
            throw new Error(REASON);
        });
        pending.thenSynchronous(function (value) { return assert.equal(value, 10); }, function () { return assert.equal("not", "here"); });
        pending.resolve(10);
        return pending;
    });
    it("observers called even after throw (asynchronous)", function () {
        var threw = false;
        var pending = new Promise_1.Promise();
        pending.thenSynchronous(function () {
            threw = true;
            throw new Error(REASON);
        });
        pending.thenSynchronous(function (value) { return assert.equal(value, 10); }, function () { return assert.equal("not", "here"); });
        pending.resolve(10);
        return pending;
    });
    var BREAK = "break", NO = "NO!";
    function testPromiseFlow(p) {
        return p
            .then(null)
            .then(function (v) {
            assert.ok(v);
            return v;
        }, function () {
            assert.ok(false);
            return true;
        })
            .then(function (v) {
            assert.ok(v);
            return v;
        })
            .then(function (v) {
            assert.ok(v);
            return false;
        })
            .then(function (v) {
            assert.ok(!v);
            return true;
        })
            .then(function (v) {
            assert.ok(v);
            throw BREAK;
        }, function (e) {
            assert.ok(false);
            return NO;
        })
            .then(null, null)
            .then(function (v) {
            assert.ok(false);
            return NO;
        }, function (e) {
            assert.equal(e, BREAK);
            return BREAK;
        })
            .then(function (v) {
            assert.equal(v, BREAK);
            return true;
        }, function (e) {
            assert.ok(false);
            return false;
        })
            .then(function (v) {
            assert.ok(v);
            throw BREAK;
        })
            .catch(function (e) {
            assert.equal(e, BREAK);
            return true;
        })
            .then(function (v) {
            assert.ok(v);
            return 10;
        })
            .then(function (v) {
            assert.equal(v, 10);
        });
    }
    it("should follow expected promise behavior flow for a resolved promise", function () {
        return testPromiseFlow(Promise_1.Promise.resolve(true));
    });
    it("should follow expected promise behavior flow for a rejected promise", function () {
        return testPromiseFlow(Promise_1.Promise
            .reject(BREAK)
            .catch(function (v) {
            assert.equal(v, BREAK);
            return true;
        }));
    });
    it("should follow expected promise behavior flow for a pending then resolved promise", function () {
        var p = new Promise_1.Promise();
        assert.ok(p.isPending);
        p.resolve(true);
        return testPromiseFlow(p);
    });
    it("should be able to use a then-able", function () {
        var p = Promise_1.Promise.createFrom(function (r) {
            r(true);
            return Promise_1.Promise.resolve(true);
        });
        return testPromiseFlow(p);
    });
    it("should be able to use a lazy", function () {
        it(".deferFromNow", function () {
            new LazyPromise_1.LazyPromise(function (resolve) {
                assert.ok(false, "Should not have triggered the resolution.");
            }).delayFromNow(1000);
            var elapsed = Stopwatch_1.default.startNew();
            return testPromiseFlow(new LazyPromise_1.LazyPromise(function (resolve) { return defer_1.defer(function () { return resolve(true); }, 1000); })
                .delayFromNow(1000)
                .thenThis(function (r) {
                var ms = elapsed.elapsedMilliseconds;
                assert.ok(ms > 1000 && ms < 2000);
            }));
        });
        it(".deferFromNow", function () {
            new LazyPromise_1.LazyPromise(function (resolve) {
                assert.ok(false, "Should not have triggered the resolution.");
            }).delayAfterResolve(1000);
            var elapsed = Stopwatch_1.default.startNew();
            return testPromiseFlow(new LazyPromise_1.LazyPromise(function (resolve) { return defer_1.defer(function () { return resolve(true); }, 1000); })
                .delayAfterResolve(1000)
                .thenThis(function (r) {
                var ms = elapsed.elapsedMilliseconds;
                assert.ok(ms > 2000 && ms < 3000);
            }));
        });
    });
    it("should be able to use promise as a resolution", function () {
        var s = new Promise_1.Promise();
        var p = new Promise_1.Promise(function (resolve) {
            defer_1.defer(function () { return resolve(s); });
        });
        assert.ok(s.isPending);
        assert.ok(p.isPending);
        s.resolve(true);
        return testPromiseFlow(p);
    });
    it("should be able to wait for all", function () {
        var other = new LazyPromise_1.LazyPromise(function (resolve) {
            resolve(4);
        });
        return Promise_1.Promise.waitAll(other, Promise_1.Promise.resolve(3), Promise_1.Promise.resolve(2), Promise_1.Promise.reject(BREAK), Promise_1.Promise.resolve(1)).thenSynchronous(function (r) {
            assert.equal(r[0].result, 4);
            assert.equal(r[1].result, 3);
            assert.equal(r[2].result, 2);
            assert.equal(r[3].result, void 0);
            assert.equal(r[3].error, BREAK);
            assert.equal(r[4].result, 1);
        }, function () { return assert.ok(false); });
    });
    it("should be able to resolve all", function () {
        var other = new LazyPromise_1.LazyPromise(function (resolve) {
            resolve(4);
        });
        return Promise_1.Promise.all(other.delayFromNow(10).delayAfterResolve(10), Promise_1.Promise.resolve(3), Promise_1.Promise.resolve(2), Promise_1.Promise.resolve(1)).thenSynchronous(function (r) {
            assert.equal(r[0], 4);
            assert.equal(r[1], 3);
            assert.equal(r[2], 2);
            assert.equal(r[3], 1);
        });
    });
    it("should resolve as rejected", function () {
        var other = new LazyPromise_1.LazyPromise(function (resolve) {
            resolve(4);
        });
        return Promise_1.Promise.all(other, Promise_1.Promise.resolve(3), Promise_1.Promise.resolve(2), Promise_1.Promise.resolve(1), Promise_1.Promise.reject(-1)).thenSynchronous(function () {
            assert.ok(false);
        }, function (e) {
            assert.equal(e, -1);
        });
    });
    it("should be resolve the first to win the race", function () {
        var other = new LazyPromise_1.LazyPromise(function (resolve, reject) {
            reject(4);
        });
        return Promise_1.Promise.race(other.delayAfterResolve(40), Promise_1.Promise.resolve(3).delayFromNow(10), Promise_1.Promise.resolve(2).delayFromNow(20), Promise_1.Promise.resolve(1).delayFromNow(30)).thenSynchronous(function (r) {
            assert.equal(r, 3);
        }, function () {
            assert.ok(false);
        });
    });
    it("should be resolve the rejection", function () {
        return Promise_1.Promise.race(Promise_1.Promise.resolve(3).delayFromNow(20), Promise_1.Promise.resolve(2).delayAfterResolve(10), Promise_1.Promise.reject(1)).thenSynchronous(function () {
            assert.ok(false);
        }, function (e) {
            assert.equal(e, 1);
        });
    });
    it("should resolve the chain fulfilled promise result.", function () {
        return new Promise_1.Promise((function (resolve) { return resolve(new Promise_1.Promise((function (resolve) { return resolve(Promise_1.Promise.resolve(1)); }))); }))
            .thenSynchronous(function (v) { return assert.equal(v, 1); }, function () { return assert.ok(false); });
    });
    it("should resolve the rejected promise result.", function () {
        return new Promise_1.Promise((function (resolve) { return resolve(Promise_1.Promise.reject(BREAK)); }))
            .thenSynchronous(function () { return assert.ok(false); }, function (e) { return assert.equal(e, BREAK); });
    });
    it("should rejected a disposed promise-result..", function () {
        return new Promise_1.Promise((function (resolve) {
            var r = Promise_1.Promise.resolve(1);
            r.dispose();
            resolve(r);
        }))
            .thenSynchronous(function () { return assert.ok(false); }, function (e) { return assert.ok(e instanceof ObjectDisposedException_1.ObjectDisposedException); });
    });
});
//# sourceMappingURL=Promise.js.map