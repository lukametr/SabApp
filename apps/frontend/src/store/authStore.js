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
        var _a, _b, _c;
        console.log('🗃️ AuthStore login:', {
            hasUser: !!(data === null || data === void 0 ? void 0 : data.user),
            hasToken: !!(data === null || data === void 0 ? void 0 : data.accessToken),
            userEmail: (_a = data === null || data === void 0 ? void 0 : data.user) === null || _a === void 0 ? void 0 : _a.email
        });
        set({ user: data.user, token: data.accessToken, loading: false });
        console.log('🗃️ Saving to localStorage:', {
            token: ((_b = data.accessToken) === null || _b === void 0 ? void 0 : _b.substring(0, 20)) + '...',
            user: (_c = data.user) === null || _c === void 0 ? void 0 : _c.email
        });
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log('🗃️ AuthStore state updated');
    },
    logout: function () {
        console.log('🗃️ AuthStore logout - clearing data');
        set({ user: null, token: null, loading: false });
        // Clear localStorage
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            console.log('🗃️ localStorage cleared');
        }
    },
    setUser: function (user) { return set({ user: user }); },
    setToken: function (token) { return set({ token: token }); },
    setError: function (error) { return set({ error: error }); },
    setLoading: function (loading) { return set({ loading: loading }); },
    loadFromStorage: function () {
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
    },
}); });
