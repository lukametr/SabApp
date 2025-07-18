"use strict";
'use client';
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
exports.default = AuthCallbackPage;
var react_1 = require("react");
var navigation_1 = require("next/navigation");
var authStore_1 = require("../../../store/authStore");
var material_1 = require("@mui/material");
function AuthCallbackPage() {
    var _this = this;
    var router = (0, navigation_1.useRouter)();
    var searchParams = (0, navigation_1.useSearchParams)();
    var _a = (0, authStore_1.useAuthStore)(), login = _a.login, logout = _a.logout;
    var _b = (0, react_1.useState)(null), error = _b[0], setError = _b[1];
    (0, react_1.useEffect)(function () {
        var handleCallback = function () { return __awaiter(_this, void 0, void 0, function () {
            var token, errorParam, payload, userData, error_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!searchParams) {
                            console.error('[Auth Callback] No search params available');
                            router.push('/auth/login?error=invalid_callback');
                            return [2 /*return*/];
                        }
                        token = searchParams.get('token');
                        errorParam = searchParams.get('error');
                        console.log('[Auth Callback] Processing...', { token: !!token, error: errorParam });
                        if (errorParam) {
                            console.error('[Auth Callback] Error from backend:', errorParam);
                            router.push("/auth/login?error=".concat(errorParam));
                            return [2 /*return*/];
                        }
                        if (!token) {
                            console.error('[Auth Callback] No token received');
                            router.push('/auth/login?error=no_token');
                            return [2 /*return*/];
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        // Decode JWT to get user info without an API call
                        console.log('[Auth Callback] Decoding token...');
                        payload = JSON.parse(atob(token.split('.')[1]));
                        console.log('[Auth Callback] Decoded token payload:', payload);
                        userData = {
                            id: payload.sub,
                            email: payload.email,
                            role: payload.role,
                            status: payload.status,
                            googleId: payload.googleId,
                            name: payload.name || ((_a = payload.email) === null || _a === void 0 ? void 0 : _a.split('@')[0]) || 'User',
                            picture: payload.picture || null,
                        };
                        console.log('[Auth Callback] Setting user data:', userData);
                        // Use the login method to properly set auth state
                        login({
                            accessToken: token,
                            user: userData
                        });
                        // Small delay to ensure auth state is set
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 100); })];
                    case 2:
                        // Small delay to ensure auth state is set
                        _b.sent();
                        // Redirect to dashboard
                        console.log('[Auth Callback] Redirecting to dashboard...');
                        router.push('/dashboard');
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _b.sent();
                        console.error('[Auth Callback] Error processing callback:', error_1);
                        logout(); // Clear any partial auth state
                        router.push('/auth/login?error=callback_failed');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        handleCallback();
    }, [searchParams, router, login, logout]);
    if (error) {
        return (<material_1.Box sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}>
        <material_1.Typography variant="h6" color="error">
          {error}
        </material_1.Typography>
      </material_1.Box>);
    }
    return (<material_1.Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
        }}>
      <material_1.CircularProgress size={60}/>
      <material_1.Typography variant="h6" sx={{ mt: 2 }}>
        შესვლა...
      </material_1.Typography>
    </material_1.Box>);
}
