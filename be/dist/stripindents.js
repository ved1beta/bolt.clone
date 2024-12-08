"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripIndents = stripIndents;
function stripIndents(arg0, ...values) {
    if (typeof arg0 !== 'string') {
        const processedString = arg0.reduce((acc, curr, i) => {
            var _a;
            acc += curr + ((_a = values[i]) !== null && _a !== void 0 ? _a : '');
            return acc;
        }, '');
        return _stripIndents(processedString);
    }
    return _stripIndents(arg0);
}
function _stripIndents(value) {
    return value
        .split('\n')
        .map((line) => line.trim())
        .join('\n')
        .trimStart()
        .replace(/[\r\n]$/, '');
}
