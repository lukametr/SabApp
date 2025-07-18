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
exports.default = DashboardPage;
var react_1 = require("react");
var navigation_1 = require("next/navigation");
var authStore_1 = require("../../store/authStore");
var Dashboard_1 = __importDefault(require("../../components/Dashboard"));
var material_1 = require("@mui/material");
function DashboardPage() {
    var _this = this;
    var router = (0, navigation_1.useRouter)();
    var _a = (0, authStore_1.useAuthStore)(), user = _a.user, isAuthenticated = _a.isAuthenticated, token = _a.token, loading = _a.loading, loadFromStorage = _a.loadFromStorage;
    var _b = (0, react_1.useState)(false), isInitialized = _b[0], setIsInitialized = _b[1];
    (0, react_1.useEffect)(function () {
        var initializeAuth = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('🔐 Dashboard: Initializing authentication...');
                        // Load from storage first
                        loadFromStorage();
                        // Give some time for auth to initialize
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 200); })];
                    case 1:
                        // Give some time for auth to initialize
                        _a.sent();
                        console.log('🔐 Dashboard state:', {
                            loading: loading,
                            isAuthenticated: isAuthenticated,
                            hasToken: !!token,
                            hasUser: !!user,
                        });
                        setIsInitialized(true);
                        return [2 /*return*/];
                }
            });
        }); };
        if (!isInitialized) {
            initializeAuth();
        }
    }, [loadFromStorage, isInitialized]);
    (0, react_1.useEffect)(function () {
        if (!isInitialized || loading) {
            return; // Still initializing
        }
        console.log('🔐 Dashboard: Checking authentication after initialization');
        console.log('🔐 Auth state:', { isAuthenticated: isAuthenticated, hasToken: !!token, hasUser: !!user });
        // Check authentication
        if (!isAuthenticated || !token || !user) {
            console.log('❌ Not authenticated, redirecting to login');
            router.push('/auth/login');
            return;
        }
        // Validate token
        try {
            var payload = JSON.parse(atob(token.split('.')[1]));
            var exp = payload.exp * 1000;
            if (Date.now() >= exp) {
                console.log('❌ Token expired, redirecting to login');
                // Clear expired auth
                authStore_1.useAuthStore.getState().logout();
                router.push('/auth/login');
                return;
            }
            console.log('✅ Authentication valid, showing dashboard');
        }
        catch (error) {
            console.error('❌ Invalid token:', error);
            authStore_1.useAuthStore.getState().logout();
            router.push('/auth/login');
        }
    }, [isInitialized, loading, isAuthenticated, token, user, router]);
    // Show loading while initializing or if still loading
    if (!isInitialized || loading || !isAuthenticated) {
        return (<material_1.Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <material_1.CircularProgress />
      </material_1.Box>);
    }
    return <Dashboard_1.default />;
}
