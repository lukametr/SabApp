"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authApi = void 0;
// Bridge file: re-export TS implementation to avoid stale compiled JS
try {
    const tsImpl = require("./authApi.ts");
    exports.authApi = tsImpl.authApi;
} catch (e) {
    try {
        const tsImplNoExt = require("./authApi");
        exports.authApi = tsImplNoExt.authApi;
    } catch (err) {
        exports.authApi = {};
    }
}
