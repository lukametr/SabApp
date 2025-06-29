"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidPassword = exports.isValidEmail = exports.getFileExtension = exports.formatFileSize = exports.formatDate = void 0;
var formatDate = function (date) {
    return new Date(date).toLocaleDateString('ka-GE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};
exports.formatDate = formatDate;
var formatFileSize = function (bytes) {
    if (bytes === 0)
        return '0 B';
    var k = 1024;
    var sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return "".concat(parseFloat((bytes / Math.pow(k, i)).toFixed(2)), " ").concat(sizes[i]);
};
exports.formatFileSize = formatFileSize;
var getFileExtension = function (filename) {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};
exports.getFileExtension = getFileExtension;
var isValidEmail = function (email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.isValidEmail = isValidEmail;
var isValidPassword = function (password) {
    return password.length >= 8;
};
exports.isValidPassword = isValidPassword;
