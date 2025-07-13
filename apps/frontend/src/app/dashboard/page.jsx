"use strict";
'use client';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DashboardPage;
var react_1 = require("react");
var navigation_1 = require("next/navigation");
var authStore_1 = require("../../store/authStore");
var Dashboard_1 = __importDefault(require("../../components/Dashboard"));
function DashboardPage() {
    var router = (0, navigation_1.useRouter)();
    var _a = (0, authStore_1.useAuthStore)(), user = _a.user, loading = _a.loading;
    // No need to call loadFromStorage here - handled by AuthProvider
    (0, react_1.useEffect)(function () {
        // Only redirect if not loading and no user
        if (!loading && !user) {
            router.push('/auth/login');
        }
    }, [user, loading, router]);
    // Show loading while checking auth state
    if (loading) {
        return <div>Loading...</div>; // or loading spinner
    }
    // Show nothing if no user (will redirect)
    if (!user) {
        return null;
    }
    return <Dashboard_1.default />;
}
