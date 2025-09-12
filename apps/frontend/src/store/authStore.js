"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuthStore = void 0;
var zustand_1 = require("zustand");
var api_1 = require("../lib/api");
// Initialize auth state from localStorage
var initializeAuth = function () {
    if (typeof window === 'undefined') {
        return { token: null, user: null, isAuthenticated: false };
    }
    try {
        var token = localStorage.getItem('token');
        var userStr = localStorage.getItem('user');
        if (token && userStr) {
            // Validate token expiration
            try {
                var payload = JSON.parse(atob(token.split('.')[1]));
                var exp = payload.exp * 1000; // Convert to milliseconds
                if (Date.now() < exp) {
                    console.log('🗃️ Valid token found in storage');
                    return {
                        token: token,
                        user: JSON.parse(userStr),
                        isAuthenticated: true,
                    };
                }
                else {
                    console.log('🗃️ Token expired, clearing storage');
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }
            catch (e) {
                console.error('🗃️ Error validating stored token:', e);
            }
        }
    }
    catch (error) {
        console.error('🗃️ Error initializing auth:', error);
    }
    return { token: null, user: null, isAuthenticated: false };
};
exports.useAuthStore = (0, zustand_1.create)(function (set, get) { return (__assign(__assign({}, initializeAuth()), { user: null, token: null, loading: true, error: null, isAuthenticated: function () {
        var state = get();
        if (!state.token || !state.user)
            return false;
        try {
            // Check token expiration
            var payload = JSON.parse(atob(state.token.split('.')[1]));
            var exp = payload.exp * 1000;
            return Date.now() < exp;
        }
        catch (_a) {
            return false;
        }
    }, login: function (data) { return __awaiter(void 0, void 0, void 0, function () {
        var payload;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            try {
                console.log('🗃️ AuthStore login:', {
                    hasUser: !!(data === null || data === void 0 ? void 0 : data.user),
                    hasToken: !!(data === null || data === void 0 ? void 0 : data.accessToken),
                    userEmail: (_a = data === null || data === void 0 ? void 0 : data.user) === null || _a === void 0 ? void 0 : _a.email
                });
                if (!data.accessToken || !data.user) {
                    throw new Error('Invalid login data');
                }
                payload = JSON.parse(atob(data.accessToken.split('.')[1]));
                if (payload.exp * 1000 < Date.now()) {
                    throw new Error('Token expired');
                }
                // Save to localStorage first
                if (typeof window !== 'undefined') {
                    console.log('🗃️ Saving to localStorage:', {
                        token: ((_b = data.accessToken) === null || _b === void 0 ? void 0 : _b.substring(0, 20)) + '...',
                        user: (_c = data.user) === null || _c === void 0 ? void 0 : _c.email
                    });
                    localStorage.setItem('token', data.accessToken);
                    localStorage.setItem('user', JSON.stringify(data.user));
                }
                // Then update state
                set({
                    user: data.user,
                    token: data.accessToken,
                    loading: false,
                    error: null
                });
                console.log('✅ AuthStore state updated successfully');
            }
            catch (error) {
                console.error('❌ Login failed:', error);
                set({ error: error instanceof Error ? error.message : 'Login failed' });
                throw error;
            }
            return [2 /*return*/];
        });
    }); }, logout: function () {
        var _a, _b;
        console.log('� Logging out...');
        // Clear all auth data
        set({
            user: null,
            token: null,
            loading: false,
            error: null
        });
        // Clear localStorage
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            console.log('🗃️ localStorage cleared');
        }
        console.log('✅ Logout complete');
    }, setUser: function (user) { return set({ user: user }); }, setToken: function (token) { return set({ token: token }); }, setError: function (error) { return set({ error: error }); }, setLoading: function (loading) { return set({ loading: loading }); }, loadFromStorage: function () {
        console.log('🗃️ Loading from localStorage...');
        // Prevent multiple simultaneous calls
        if (typeof window === 'undefined') {
            console.log('🗃️ Server-side rendering, skipping localStorage');
            set({ loading: false });
            return;
        }
        try {
            var token = localStorage.getItem('token');
            var user = localStorage.getItem('user');
            console.log('🗃️ Storage data found:', {
                hasToken: !!token,
                hasUser: !!user,
                tokenPrefix: (token === null || token === void 0 ? void 0 : token.substring(0, 20)) + '...' || 'none'
            });
            if (token && user) {
                var parsedUser = JSON.parse(user);
                console.log('🗃️ Restored user from storage:', parsedUser.email);
                // Validate that the token is not expired (basic check)
                try {
                    var tokenPayload = JSON.parse(atob(token.split('.')[1]));
                    var isExpired = tokenPayload.exp * 1000 < Date.now();
                    if (isExpired) {
                        console.log('🗃️ Token expired, clearing storage');
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        set({ user: null, token: null, loading: false });
                        return;
                    }
                }
                catch (tokenError) {
                    console.error('🗃️ Error parsing token:', tokenError);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    set({ user: null, token: null, loading: false });
                    return;
                }
                set({ token: token, user: parsedUser, loading: false });
                console.log('🗃️ Auth state restored successfully');
            }
            else {
                console.log('🗃️ No valid storage data found');
                set({ loading: false });
            }
        }
        catch (error) {
            console.error('🗃️ Error loading from storage:', error);
            // Clear potentially corrupted data
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            set({ user: null, token: null, loading: false });
        }
    }, fetchUserData: function () { return __awaiter(void 0, void 0, void 0, function () {
        var token, response, error_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log('🔄 Fetching user data from /auth/me...');
                    // Only run on client side
                    if (typeof window === 'undefined') {
                        console.log('🔄 Server-side, skipping fetchUserData');
                        return [2 /*return*/, false];
                    }
                    token = localStorage.getItem('token');
                    if (!token) {
                        console.log('🔄 No token found, cannot fetch user data');
                        return [2 /*return*/, false];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, api_1.authApi.me()];
                case 2:
                    response = _b.sent();
                    console.log('✅ User data fetched successfully:', response.data);
                    set({
                        user: response.data,
                        loading: false,
                        error: null
                    });
                    // Update localStorage with fresh user data
                    localStorage.setItem('user', JSON.stringify(response.data));
                    return [2 /*return*/, true];
                case 3:
                    error_1 = _b.sent();
                    console.error('❌ Failed to fetch user data:', error_1);
                    // If token is invalid, clear auth state
                    if (((_a = error_1.response) === null || _a === void 0 ? void 0 : _a.status) === 401) {
                        console.log('🔄 Token invalid, clearing auth state');
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        set({
                            user: null,
                            token: null,
                            loading: false,
                            error: 'Session expired'
                        });
                    }
                    return [2 /*return*/, false];
                case 4: return [2 /*return*/];
            }
        });
    }); } })); });
