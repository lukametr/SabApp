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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Home;
var react_1 = require("react");
var navigation_1 = require("next/navigation");
var LandingPage_1 = __importDefault(require("../components/LandingPage"));
var authStore_1 = require("../store/authStore");
var material_1 = require("@mui/material");
function Home() {
    var _this = this;
    var router = (0, navigation_1.useRouter)();
    var searchParams = (0, navigation_1.useSearchParams)();
    var _a = (0, authStore_1.useAuthStore)(), isAuthenticated = _a.isAuthenticated, token = _a.token, user = _a.user, loadFromStorage = _a.loadFromStorage, loading = _a.loading;
    var _b = (0, react_1.useState)(true), isChecking = _b[0], setIsChecking = _b[1];
    (0, react_1.useEffect)(function () {
        var checkAuthAndRedirect = function () { return __awaiter(_this, void 0, void 0, function () {
            var auth, tokenParam, userParam, error, currentState, payload, exp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('🏠 Home: Starting auth check...');
                        // First, load from storage
                        loadFromStorage();
                        // Give time for auth to initialize
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 300); })];
                    case 1:
                        // Give time for auth to initialize
                        _a.sent();
                        auth = searchParams.get('auth');
                        tokenParam = searchParams.get('token');
                        userParam = searchParams.get('user');
                        error = searchParams.get('error');
                        if (auth === 'success' && tokenParam && userParam) {
                            try {
                                console.log('🏠 Processing OAuth success parameters');
                                // Store authentication data
                                localStorage.setItem('token', tokenParam);
                                localStorage.setItem('user', decodeURIComponent(userParam));
                                // Load the new auth state
                                loadFromStorage();
                                // Clean URL and redirect to dashboard
                                router.replace('/dashboard');
                                return [2 /*return*/];
                            }
                            catch (err) {
                                console.error('Failed to process authentication:', err);
                                router.replace('/?error=Authentication processing failed');
                                return [2 /*return*/];
                            }
                        }
                        else if (error) {
                            console.error('Authentication error:', error);
                            setIsChecking(false);
                            return [2 /*return*/];
                        }
                        currentState = authStore_1.useAuthStore.getState();
                        console.log('🏠 Current auth state:', {
                            isAuthenticated: currentState.isAuthenticated,
                            hasToken: !!currentState.token,
                            hasUser: !!currentState.user,
                        });
                        if (currentState.isAuthenticated && currentState.token && currentState.user) {
                            try {
                                payload = JSON.parse(atob(currentState.token.split('.')[1]));
                                exp = payload.exp * 1000;
                                if (Date.now() < exp) {
                                    console.log('🏠 User is authenticated, redirecting to dashboard');
                                    router.push('/dashboard');
                                    return [2 /*return*/];
                                }
                                else {
                                    console.log('🏠 Token expired, staying on home page');
                                    authStore_1.useAuthStore.getState().logout();
                                }
                            }
                            catch (error) {
                                console.error('🏠 Error validating token:', error);
                                authStore_1.useAuthStore.getState().logout();
                            }
                        }
                        console.log('🏠 User is not authenticated, showing home page');
                        setIsChecking(false);
                        return [2 /*return*/];
                }
            });
        }); };
        checkAuthAndRedirect();
    }, [searchParams, router, loadFromStorage]);
    // Show loading while checking auth
    if (isChecking || loading) {
        return (<material_1.Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <material_1.CircularProgress />
      </material_1.Box>);
    }
    return <LandingPage_1.default />;
}
