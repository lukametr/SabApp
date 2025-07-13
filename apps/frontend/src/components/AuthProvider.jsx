"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AuthProvider;
var react_1 = require("react");
var authStore_1 = require("../store/authStore");
function AuthProvider(_a) {
    var children = _a.children;
    var loadFromStorage = (0, authStore_1.useAuthStore)().loadFromStorage;
    (0, react_1.useEffect)(function () {
        console.log('🔐 AuthProvider: Initializing auth state from storage...');
        loadFromStorage();
    }, []); // Only on mount, once globally
    return <>{children}</>;
}
