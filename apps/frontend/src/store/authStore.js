"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuthStore = void 0;
var zustand_1 = require("zustand");
exports.useAuthStore = (0, zustand_1.create)(function (set) { return ({
    user: null,
    token: null,
    loading: true, // Start with loading true
    error: null,
    login: function (data) {
        set({ user: data.user, token: data.accessToken, loading: false });
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.user));
    },
    logout: function () {
        set({ user: null, token: null, loading: false });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
    setUser: function (user) { return set({ user: user }); },
    setToken: function (token) { return set({ token: token }); },
    setError: function (error) { return set({ error: error }); },
    setLoading: function (loading) { return set({ loading: loading }); },
    loadFromStorage: function () {
        try {
            var token = localStorage.getItem('token');
            var user = localStorage.getItem('user');
            if (token && user) {
                set({ token: token, user: JSON.parse(user), loading: false });
            }
            else {
                set({ loading: false });
            }
        }
        catch (error) {
            console.error('Error loading from storage:', error);
            set({ loading: false });
        }
    },
}); });
