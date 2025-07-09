"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
// Use relative URL when served from backend, external URL for development
var getApiUrl = function () {
    // Always use env variable or fallback, regardless of environment
    return process.env.NEXT_PUBLIC_API_URL || 'https://saba-app-production.up.railway.app/api';
};
var API_URL = getApiUrl();
console.log('🔧 API Configuration:', {
    NODE_ENV: process.env.NODE_ENV,
    API_URL: API_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    isClient: typeof window !== 'undefined',
});
var api = axios_1.default.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: 15000,
});
// Add request interceptor for JWT
api.interceptors.request.use(function (config) {
    var _a;
    // Ensure proper URL construction
    if (config.url && !config.url.startsWith('http')) {
        config.url = config.url.replace(/^\/+/, ''); // Remove leading slashes
    }
    console.log('🚀 API Request:', {
        method: (_a = config.method) === null || _a === void 0 ? void 0 : _a.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        fullURL: config.url ? "".concat(config.baseURL, "/").concat(config.url).replace(/\/+/g, '/') : config.baseURL,
    });
    if (typeof window !== 'undefined') {
        var token = localStorage.getItem('token');
        if (token) {
            config.headers = config.headers || {};
            config.headers['Authorization'] = "Bearer ".concat(token);
        }
    }
    return config;
}, function (error) {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
});
// Add response interceptor for error handling
api.interceptors.response.use(function (response) {
    console.log('✅ API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
    });
    return response;
}, function (error) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    console.error('❌ API Error:', {
        message: error.message,
        status: (_a = error.response) === null || _a === void 0 ? void 0 : _a.status,
        statusText: (_b = error.response) === null || _b === void 0 ? void 0 : _b.statusText,
        data: (_c = error.response) === null || _c === void 0 ? void 0 : _c.data,
        url: (_d = error.config) === null || _d === void 0 ? void 0 : _d.url,
        baseURL: (_e = error.config) === null || _e === void 0 ? void 0 : _e.baseURL,
        fullURL: ((_f = error.config) === null || _f === void 0 ? void 0 : _f.url) ? "".concat((_g = error.config) === null || _g === void 0 ? void 0 : _g.baseURL, "/").concat((_h = error.config) === null || _h === void 0 ? void 0 : _h.url).replace(/\/+/g, '/') : (_j = error.config) === null || _j === void 0 ? void 0 : _j.baseURL,
    });
    // Handle specific error cases
    if (((_k = error.response) === null || _k === void 0 ? void 0 : _k.status) === 401) {
        // Clear invalid token
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
        }
    }
    return Promise.reject(error);
});
exports.default = api;
