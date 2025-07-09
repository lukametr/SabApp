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
    var _a = (0, authStore_1.useAuthStore)(), user = _a.user, loadFromStorage = _a.loadFromStorage;
    (0, react_1.useEffect)(function () {
        loadFromStorage();
    }, [loadFromStorage]);
    (0, react_1.useEffect)(function () {
        // Simple auth check - redirect to login if no user
        if (!user) {
            router.push('/auth/login');
        }
    }, [user, router]);
    // Show loading or dashboard based on auth state
    if (!user) {
        return null; // or loading spinner
    }
    return <Dashboard_1.default />;
}
