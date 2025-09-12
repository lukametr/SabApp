'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.authApi = exports.documentApi = void 0;
var documentApi_1 = require('./documentApi');
Object.defineProperty(exports, 'documentApi', {
  enumerable: true,
  get: function () {
    return documentApi_1.documentApi;
  },
});
var authApi_1 = require('./authApi');
Object.defineProperty(exports, 'authApi', {
  enumerable: true,
  get: function () {
    return authApi_1.authApi;
  },
});
