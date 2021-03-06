(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./constants/Targets", "./constants/ModuleTypes", "./constants/TaskNames", "gulp", "./tsc"], factory);
    }
})(function (require, exports) {
    "use strict";
    var TARGET = require("./constants/Targets");
    var MODULE = require("./constants/ModuleTypes");
    var TASK = require("./constants/TaskNames");
    var gulp = require("gulp");
    var tsc = require("./tsc");
    gulp.task(TASK.TYPESCRIPT_QUNIT, function () { return tsc.atV2('./tests/qunit', TARGET.ES5, MODULE.UMD, false, true); });
    gulp.task(TASK.TYPESCRIPT_MOCHA, [
        TASK.DIST_COMMONJS
    ], function () { return tsc.atV2('./tests/mocha', TARGET.ES5, MODULE.COMMONJS, false, true); });
    gulp.task(TASK.BUILD + ".tests", [
        TASK.TYPESCRIPT_QUNIT,
        TASK.TYPESCRIPT_MOCHA
    ]);
});
//# sourceMappingURL=tests.js.map