/*!
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ObservableBase_1 = require("./ObservableBase");
var extends_1 = require("../../extends");
var __extends = extends_1.default;
var ObservableNodeBase = (function (_super) {
    __extends(ObservableNodeBase, _super);
    function ObservableNodeBase() {
        _super.apply(this, arguments);
    }
    ObservableNodeBase.prototype.onNext = function (value) {
        this._onNext(value);
    };
    ObservableNodeBase.prototype.onError = function (error) {
        this._onError(error);
    };
    ObservableNodeBase.prototype.onCompleted = function () {
        this._onCompleted();
    };
    return ObservableNodeBase;
}(ObservableBase_1.default));
exports.ObservableNodeBase = ObservableNodeBase;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ObservableNodeBase;
//# sourceMappingURL=ObservableNodeBase.js.map