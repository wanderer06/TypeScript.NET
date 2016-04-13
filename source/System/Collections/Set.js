/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./LinkedNodeList", "../Exceptions/ArgumentNullException", "./Enumeration/forEach", "../Disposable/Utility"], factory);
    }
})(function (require, exports) {
    "use strict";
    var LinkedNodeList_1 = require("./LinkedNodeList");
    var ArgumentNullException_1 = require("../Exceptions/ArgumentNullException");
    var forEach_1 = require("./Enumeration/forEach");
    var Utility_1 = require("../Disposable/Utility");
    var OTHER = 'other';
    var Set = (function () {
        function Set(source) {
            this._registry = {};
            this._set = new LinkedNodeList_1.default();
            this._count = 0;
            if (source)
                this.unionWith(source);
        }
        Object.defineProperty(Set.prototype, "count", {
            get: function () {
                return this._count;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Set.prototype, "isReadOnly", {
            get: function () { return true; },
            enumerable: true,
            configurable: true
        });
        Set.prototype.exceptWith = function (other) {
            var _this = this;
            if (!other)
                throw new ArgumentNullException_1.default(OTHER);
            forEach_1.default(other, function (v) {
                _this.remove(v);
            });
        };
        Set.prototype.intersectWith = function (other) {
            var _this = this;
            if (!other)
                throw new ArgumentNullException_1.default(OTHER);
            if (other instanceof Set) {
                var s_1 = this._set;
                s_1.forEach(function (n) {
                    if (!other.contains(n.value) && s_1.removeNode(n)) {
                        --_this._count;
                    }
                });
            }
            else {
                Utility_1.using(new Set(other), function (o) { return _this.intersectWith(o); });
            }
        };
        Set.prototype.isProperSubsetOf = function (other) {
            var _this = this;
            if (!other)
                throw new ArgumentNullException_1.default(OTHER);
            return other instanceof Set
                ? other.isProperSupersetOf(this)
                : Utility_1.using(new Set(other), function (o) { return o.isProperSupersetOf(_this); });
        };
        Set.prototype.isProperSupersetOf = function (other) {
            var _this = this;
            if (!other)
                throw new ArgumentNullException_1.default(OTHER);
            var result = true, count;
            if (other instanceof Set) {
                result = this.isSubsetOf(other);
                count = other._count;
            }
            else {
                Utility_1.using(new Set(), function (o) {
                    forEach_1.default(other, function (v) {
                        o.add(v);
                        return result = _this.contains(v);
                    });
                    count = o._count;
                });
            }
            return result && this._count > count;
        };
        Set.prototype.isSubsetOf = function (other) {
            var _this = this;
            if (!other)
                throw new ArgumentNullException_1.default(OTHER);
            return other instanceof Set
                ? other.isSupersetOf(this)
                : Utility_1.using(new Set(other), function (o) { return o.isSupersetOf(_this); });
        };
        Set.prototype.isSupersetOf = function (other) {
            var _this = this;
            if (!other)
                throw new ArgumentNullException_1.default(OTHER);
            var result = true;
            forEach_1.default(other, function (v) {
                return result = _this.contains(v);
            });
            return result;
        };
        Set.prototype.overlaps = function (other) {
            var _this = this;
            if (!other)
                throw new ArgumentNullException_1.default(OTHER);
            var result = false;
            forEach_1.default(other, function (v) {
                return !(result = _this.contains(v));
            });
            return result;
        };
        Set.prototype.setEquals = function (other) {
            if (!other)
                throw new ArgumentNullException_1.default(OTHER);
            return this._count == (other instanceof Set
                ? other._count
                : Utility_1.using(new Set(other), function (o) { return o._count; }))
                && this.isSubsetOf(other);
        };
        Set.prototype.symmetricExceptWith = function (other) {
            var _this = this;
            if (!other)
                throw new ArgumentNullException_1.default(OTHER);
            if (other instanceof Set) {
                forEach_1.default(other, function (v) {
                    if (_this.contains(v))
                        _this.remove(v);
                    else
                        _this.add(v);
                });
            }
            else {
                Utility_1.using(new Set(other), function (o) { return _this.symmetricExceptWith(o); });
            }
        };
        Set.prototype.unionWith = function (other) {
            var _this = this;
            forEach_1.default(other, function (v) {
                _this.add(v);
            });
        };
        Set.prototype.add = function (item) {
            if (!this.contains(item)) {
                var type = typeof item;
                var t = this._registry[type];
                var node = {
                    value: item,
                    previous: null,
                    next: null
                };
                this._set.addNode(node);
                t[item] = node;
                ++this._count;
            }
        };
        Set.prototype.clear = function () {
            this._count = 0;
            wipe(this._registry, 2);
            return this._set.clear();
        };
        Set.prototype.dispose = function () {
            this.clear();
        };
        Set.prototype._getNode = function (item) {
            var t = this._registry[typeof item];
            return t && t[item];
        };
        Set.prototype.contains = function (item) {
            return !!this._getNode(item);
        };
        Set.prototype.copyTo = function (array, index) {
            if (index === void 0) { index = 0; }
            if (!array)
                throw new ArgumentNullException_1.default('array');
            var minLength = index + this._count;
            if (array.length < minLength)
                array.length = minLength;
            return LinkedNodeList_1.default.copyValues(this._set, array, index);
        };
        Set.prototype.toArray = function () {
            return this._set.map(function (n) { return n.value; });
        };
        Set.prototype.remove = function (item) {
            var node = this._getNode(item);
            if (node && this._set.removeNode(node)) {
                --this._count;
                return 1;
            }
            return 0;
        };
        Set.prototype.getEnumerator = function () {
            return LinkedNodeList_1.default.valueEnumeratorFrom(this._set);
        };
        return Set;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Set;
    function wipe(map, depth) {
        if (depth === void 0) { depth = 1; }
        if (depth) {
            for (var _i = 0, _a = Object.keys(map); _i < _a.length; _i++) {
                var key = _a[_i];
                var v = map[key];
                delete map[key];
                wipe(v, depth - 1);
            }
        }
    }
});
//# sourceMappingURL=Set.js.map