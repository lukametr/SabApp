"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
// Use relative URL when served from backend, external URL for development
var API_URL = process.env.NODE_ENV === 'production'
    ? '/api'
    : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001');
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
    if (typeof window !== 'undefined') {
        var token = localStorage.getItem('token');
        if (token) {
            config.headers = config.headers || {};
            config.headers['Authorization'] = "Bearer ".concat(token);
        }
    }
    return config;
}, function (error) {
    console.error('Request Error:', error);
    return Promise.reject(error);
});
// Add response interceptor for error handling
api.interceptors.response.use(function (response) { return response; }, function (error) {
    var _a, _b, _c, _d;
    console.error('API Error:', {
        message: error.message,
        status: (_a = error.response) === null || _a === void 0 ? void 0 : _a.status,
        data: (_b = error.response) === null || _b === void 0 ? void 0 : _b.data,
        url: (_c = error.config) === null || _c === void 0 ? void 0 : _c.url,
    });
    // Handle specific error cases
    if (((_d = error.response) === null || _d === void 0 ? void 0 : _d.status) === 401) {
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
