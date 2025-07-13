"use strict";
'use client';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ProfileClient;
var authStore_1 = require("../../store/authStore");
var react_1 = require("react");
var navigation_1 = require("next/navigation");
var image_1 = __importDefault(require("next/image"));
function ProfileClient() {
    var _a = (0, authStore_1.useAuthStore)(), user = _a.user, loading = _a.loading, loadFromStorage = _a.loadFromStorage;
    var router = (0, navigation_1.useRouter)();
    (0, react_1.useEffect)(function () {
        loadFromStorage();
    }, []); // Load only on mount
    (0, react_1.useEffect)(function () {
        // Only redirect if not loading and no user
        if (!loading && !user) {
            router.replace('/');
        }
    }, [user, loading, router]);
    if (loading) {
        return <div>Loading...</div>; // or loading spinner
    }
    if (!user)
        return null;
    return (<div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">პროფილი</h1>
      <div className="flex items-center space-x-4 mb-4">
        {user.picture && (<image_1.default src={user.picture} alt="profile" width={64} height={64} className="rounded-full"/>)}
        <div>
          <div className="font-semibold text-lg">{user.name}</div>
          <div className="text-gray-600">{user.email}</div>
        </div>
      </div>
      <div className="mb-2">პირადი ნომერი: <span className="font-mono">{user.personalNumber}</span></div>
      <div className="mb-2">ტელეფონი: <span className="font-mono">{user.phoneNumber}</span></div>
      <div className="mb-2">სტატუსი: <span className="font-mono">{user.status}</span></div>
      <div className="mb-2">როლი: <span className="font-mono">{user.role}</span></div>
      <div className="mb-2">ელფოსტის დადასტურება: <span className="font-mono">{user.isEmailVerified ? 'დადასტურებულია' : 'ვერ დადასტურდა'}</span></div>
      <div className="mb-2">ბოლო შესვლა: <span className="font-mono">{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString('ka-GE') : '-'}</span></div>
    </div>);
}
