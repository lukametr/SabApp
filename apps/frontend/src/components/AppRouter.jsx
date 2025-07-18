"use strict";
'use client';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AppRouter;
var react_1 = __importStar(require("react"));
var LandingPage_1 = __importDefault(require("./LandingPage"));
var Dashboard_1 = __importDefault(require("./Dashboard"));
var LoginPage_1 = __importDefault(require("./LoginPage"));
var RegisterPage_1 = __importDefault(require("./RegisterPage"));
var navigation_1 = require("next/navigation");
function AppRouter() {
    var router = (0, navigation_1.useRouter)();
    var pathname = (0, navigation_1.usePathname)();
    var _a = (0, react_1.useState)(null), user = _a[0], setUser = _a[1];
    var _b = (0, react_1.useState)(true), loading = _b[0], setLoading = _b[1];
    var _c = (0, react_1.useState)(false), mounted = _c[0], setMounted = _c[1];
    // Handle hydration
    (0, react_1.useEffect)(function () {
        setMounted(true);
    }, []);
    (0, react_1.useEffect)(function () {
        if (!mounted)
            return;
        // Check for stored user data only after hydration
        var storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            }
            catch (error) {
                console.error('Error parsing stored user:', error);
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, [mounted]);
    var handleLogin = function (userData) {
        setUser(userData);
        if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(userData));
        }
    };
    var handleRegister = function (userData) {
        setUser(userData);
        if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(userData));
        }
    };
    var handleLogout = function () {
        setUser(null);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('user');
        }
        router.push('/');
    };
    // Show loading until mounted to prevent hydration mismatch
    if (!mounted || loading) {
        return <div>Loading...</div>; // TODO: Add proper loading component
    }
    // Route handling
    if (pathname === '/auth/login') {
        return <LoginPage_1.default onLogin={handleLogin}/>;
    }
    if (pathname === '/auth/register') {
        return <RegisterPage_1.default onRegister={handleRegister}/>;
    }
    if (pathname === '/dashboard') {
        if (!user) {
            router.push('/auth/login');
            return <div>Redirecting...</div>;
        }
        return <Dashboard_1.default user={user}/>;
    }
    // Default route - Landing page
    if (user && pathname === '/') {
        // If user is logged in and on landing page, redirect to dashboard
        router.push('/dashboard');
        return <div>Redirecting...</div>;
    }
    return <LandingPage_1.default />;
}
