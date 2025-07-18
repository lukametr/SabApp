"use strict";
'use client';
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Navigation;
var link_1 = __importDefault(require("next/link"));
var navigation_1 = require("next/navigation");
var authStore_1 = require("../store/authStore");
var react_1 = require("react");
var navigation_2 = require("next/navigation");
var google_1 = require("@react-oauth/google");
var image_1 = __importDefault(require("next/image"));
var api_1 = __importDefault(require("../lib/api"));
var RegistrationModal_1 = __importDefault(require("./RegistrationModal"));
function Navigation() {
    var _this = this;
    var pathname = (0, navigation_1.usePathname)();
    var router = (0, navigation_2.useRouter)();
    var _a = (0, authStore_1.useAuthStore)(), user = _a.user, logout = _a.logout, login = _a.login;
    var _b = (0, react_1.useState)(false), showRegistration = _b[0], setShowRegistration = _b[1];
    var _c = (0, react_1.useState)(null), pendingIdToken = _c[0], setPendingIdToken = _c[1];
    var _d = (0, react_1.useState)(null), pendingUserInfo = _d[0], setPendingUserInfo = _d[1];
    var _e = (0, react_1.useState)(false), loading = _e[0], setLoading = _e[1];
    var _f = (0, react_1.useState)(''), authError = _f[0], setAuthError = _f[1];
    var _g = (0, react_1.useState)(false), mobileMenuOpen = _g[0], setMobileMenuOpen = _g[1];
    var handleSmoothScroll = function (elementId) {
        var element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };
    // No need to call loadFromStorage here - handled by AuthProvider
    var handleGoogleSuccess = (0, react_1.useCallback)(function (credentialResponse) { return __awaiter(_this, void 0, void 0, function () {
        var idToken, res, err_1, error, err_2, error;
        var _a, _b, _c, _d, _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    _h.trys.push([0, 5, , 6]);
                    console.log('Google Sign-In response:', credentialResponse);
                    idToken = credentialResponse.credential;
                    if (!idToken) {
                        console.error('No ID token received from Google');
                        alert('Google ავტორიზაციის შეცდომა: ტოკენი ვერ მოიძებნა');
                        return [2 /*return*/];
                    }
                    console.log('ID token received, length:', idToken.length);
                    _h.label = 1;
                case 1:
                    _h.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, api_1.default.post('/auth/google', {
                            idToken: idToken,
                            // Don't send empty personalNumber and phoneNumber for initial check
                        })];
                case 2:
                    res = _h.sent();
                    console.log('Auth response:', res.data);
                    login(res.data);
                    router.push('/dashboard');
                    router.refresh();
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _h.sent();
                    error = err_1;
                    console.error('Auth API error:', error);
                    // Check if this is a registration required error
                    if (((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.status) === 400 &&
                        ((_c = (_b = error === null || error === void 0 ? void 0 : error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.code) === 'REGISTRATION_REQUIRED') {
                        // User doesn't exist, show registration form
                        setPendingIdToken(idToken);
                        setPendingUserInfo(error.response.data.userInfo);
                        setShowRegistration(true);
                        setAuthError('');
                    }
                    else {
                        setAuthError('ავტორიზაციის შეცდომა: ' + (((_e = (_d = error === null || error === void 0 ? void 0 : error.response) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.message) || (error === null || error === void 0 ? void 0 : error.message) || 'უცნობი შეცდომა'));
                    }
                    return [3 /*break*/, 4];
                case 4: return [3 /*break*/, 6];
                case 5:
                    err_2 = _h.sent();
                    error = err_2;
                    console.error('Google Sign-In error:', error);
                    setAuthError('ავტორიზაციის შეცდომა: ' + (((_g = (_f = error === null || error === void 0 ? void 0 : error.response) === null || _f === void 0 ? void 0 : _f.data) === null || _g === void 0 ? void 0 : _g.message) || (error === null || error === void 0 ? void 0 : error.message) || 'უცნობი შეცდომა'));
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); }, [login, router]);
    // Use the same working Google login logic as LoginPage
    var handleWorkingGoogleLogin = (0, google_1.useGoogleLogin)({
        onSuccess: function (tokenResponse) { return __awaiter(_this, void 0, void 0, function () {
            var userInfoResponse, userInfo, res, err_3, error, error_1;
            var _a, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _f.trys.push([0, 9, 10, 11]);
                        setLoading(true);
                        setAuthError('');
                        console.log('🔧 Google login success, getting user info...');
                        return [4 /*yield*/, fetch("https://www.googleapis.com/oauth2/v2/userinfo?access_token=".concat(tokenResponse.access_token), {
                                headers: {
                                    Authorization: "Bearer ".concat(tokenResponse.access_token),
                                    Accept: 'application/json'
                                }
                            })];
                    case 1:
                        userInfoResponse = _f.sent();
                        if (!userInfoResponse.ok) return [3 /*break*/, 7];
                        return [4 /*yield*/, userInfoResponse.json()];
                    case 2:
                        userInfo = _f.sent();
                        console.log('🔧 User info received:', userInfo);
                        _f.label = 3;
                    case 3:
                        _f.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, api_1.default.post('/auth/google', {
                                // Send user info to backend for authentication
                                googleId: userInfo.id,
                                email: userInfo.email,
                                name: userInfo.name,
                                picture: userInfo.picture
                            })];
                    case 4:
                        res = _f.sent();
                        console.log('🔧 Backend auth response:', res.data);
                        login(res.data);
                        router.push('/dashboard');
                        router.refresh();
                        return [3 /*break*/, 6];
                    case 5:
                        err_3 = _f.sent();
                        error = err_3;
                        console.error('� Backend auth error:', error);
                        // Check if this is a registration required error
                        if (((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.status) === 400 &&
                            ((_c = (_b = error === null || error === void 0 ? void 0 : error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.code) === 'REGISTRATION_REQUIRED') {
                            // Show registration form with Google user info
                            setPendingUserInfo(userInfo);
                            setShowRegistration(true);
                            setAuthError('');
                        }
                        else {
                            setAuthError('ავტორიზაციის შეცდომა: ' + (((_e = (_d = error === null || error === void 0 ? void 0 : error.response) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.message) || (error === null || error === void 0 ? void 0 : error.message) || 'უცნობი შეცდომა'));
                        }
                        return [3 /*break*/, 6];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        console.error('🔧 Failed to get user info from Google');
                        setAuthError('Google-დან მომხმარებლის ინფორმაციის მიღება ვერ მოხერხდა');
                        _f.label = 8;
                    case 8: return [3 /*break*/, 11];
                    case 9:
                        error_1 = _f.sent();
                        console.error('🔧 Google login error:', error_1);
                        setAuthError('Google-ით შესვლისას დაფიქსირდა შეცდომა');
                        return [3 /*break*/, 11];
                    case 10:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 11: return [2 /*return*/];
                }
            });
        }); },
        onError: function (error) {
            console.error('🔧 Google login error:', error);
            setAuthError('Google-ით შესვლისას დაფიქსირდა შეცდომა');
        }
    });
    var handleCustomGoogleSignIn = function () {
        // Use the working Google login implementation
        handleWorkingGoogleLogin();
    };
    (0, react_1.useEffect)(function () {
        // Initialize Google Sign-In
        console.log('🔧 Initializing Google Sign-In...');
        var clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        console.log('🔑 Google Client ID:', {
            clientId: clientId,
            isConfigured: clientId && clientId !== 'YOUR_GOOGLE_CLIENT_ID_HERE',
            envVars: {
                NODE_ENV: process.env.NODE_ENV,
                NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            }
        });
        if (!clientId || clientId === 'YOUR_GOOGLE_CLIENT_ID_HERE') {
            console.error('❌ Google Client ID not configured properly');
            console.error('💡 Please set NEXT_PUBLIC_GOOGLE_CLIENT_ID in your environment variables');
            return;
        }
        // Initialize Google API for both development and production
        if (window.google && window.google.accounts) {
            console.log('✅ Google API loaded, initializing...');
            try {
                // Check if we're on mobile
                var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                window.google.accounts.id.initialize(__assign({ client_id: clientId, callback: handleGoogleSuccess, auto_select: false, cancel_on_tap_outside: true, prompt_parent_id: 'google-signin-container', ux_mode: 'redirect', scope: 'openid email profile', locale: 'ka' }, (isMobile && {
                    context: 'signin',
                    itp_support: true,
                })));
                console.log('✅ Google Sign-In initialized successfully');
            }
            catch (error) {
                console.error('❌ Google Sign-In initialization failed:', error);
            }
        }
        else {
            console.error('❌ Google API not loaded - script may not have loaded yet');
        }
    }, [handleGoogleSuccess, user]);
    var isActive = function (path) { return pathname === path; };
    var handleRegistrationSubmit = function (data) { return __awaiter(_this, void 0, void 0, function () {
        var res, err_4, error;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!pendingIdToken)
                        return [2 /*return*/];
                    setLoading(true);
                    setAuthError('');
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, api_1.default.post('/auth/google/complete-registration', {
                            idToken: pendingIdToken,
                            personalNumber: data.personalNumber,
                            phoneNumber: data.phoneNumber,
                        })];
                case 2:
                    res = _c.sent();
                    login(res.data);
                    setShowRegistration(false);
                    setPendingIdToken(null);
                    setPendingUserInfo(null);
                    router.push('/dashboard');
                    router.refresh();
                    return [3 /*break*/, 5];
                case 3:
                    err_4 = _c.sent();
                    error = err_4;
                    setAuthError('რეგისტრაციის შეცდომა: ' + (((_b = (_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || (error === null || error === void 0 ? void 0 : error.message) || 'უცნობი შეცდომა'));
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleLogout = function () {
        logout();
        router.push('/');
        router.refresh();
    };
    return (<>
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <link_1.default href="/" className="text-xl font-bold text-primary-600">
                  SabApp
                </link_1.default>
              </div>
              {/* Desktop Menu */}
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {!user && (<>
                    <link_1.default href="/" className={"inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ".concat(isActive('/')
                ? 'border-primary-500 text-gray-900'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700')}>
                      მთავარი
                    </link_1.default>
                    <button onClick={function () { return handleSmoothScroll('about'); }} className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                      ჩვენი მიზანი
                    </button>
                    <button onClick={function () { return handleSmoothScroll('demo'); }} className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                      ფორმების ნიმუშები
                    </button>
                    <button onClick={function () { return handleSmoothScroll('contact'); }} className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                      კავშირი
                    </button>
                  </>)}
                {user && (<link_1.default href="/dashboard" className={"inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ".concat(isActive('/dashboard')
                ? 'border-primary-500 text-gray-900'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700')}>
                    სამუშაო სივრცე
                  </link_1.default>)}
              </div>
            </div>
            
            {/* Desktop Right Side */}
            <div className="hidden sm:flex sm:items-center sm:space-x-4">
              {!user && (<>
                  <link_1.default href="/auth/login" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                    შესვლა
                  </link_1.default>
                  <link_1.default href="/auth/register" className="px-3 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700">
                    რეგისტრაცია
                  </link_1.default>
                </>)}
              {user && (<>
                  <link_1.default href="/profile" className="flex items-center space-x-2">
                    {user.picture && (<image_1.default src={user.picture} alt="profile" width={32} height={32} className="rounded-full"/>)}
                    <span className="font-medium text-gray-700 hidden lg:inline">{user.name}</span>
                  </link_1.default>
                  <button onClick={handleLogout} className="px-3 py-2 rounded bg-red-500 text-white hover:bg-red-600 text-sm">
                    გამოსვლა
                  </button>
                </>)}
            </div>

            {/* Mobile menu button */}
            <div className="sm:hidden flex items-center">
              <button onClick={function () { return setMobileMenuOpen(!mobileMenuOpen); }} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500" aria-expanded="false">
                <span className="sr-only">Open main menu</span>
                {!mobileMenuOpen ? (<svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
                  </svg>) : (<svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                  </svg>)}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (<div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {!user && (<>                  <link_1.default href="/" className={"block pl-3 pr-4 py-2 border-l-4 text-base font-medium ".concat(isActive('/')
                    ? 'bg-primary-50 border-primary-500 text-primary-700'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300')} onClick={function () { return setMobileMenuOpen(false); }}>
                    მთავარი
                  </link_1.default>
                  <button onClick={function () {
                    handleSmoothScroll('about');
                    setMobileMenuOpen(false);
                }} className="border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left">
                    ჩვენი მიზანი
                  </button>
                  <button onClick={function () {
                    handleSmoothScroll('demo');
                    setMobileMenuOpen(false);
                }} className="border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left">
                    ფორმების ნიმუშები
                  </button>
                  <button onClick={function () {
                    handleSmoothScroll('contact');
                    setMobileMenuOpen(false);
                }} className="border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left">
                    კავშირი
                  </button>
                </>)}
              {user && (<link_1.default href="/dashboard" className={"block pl-3 pr-4 py-2 border-l-4 text-base font-medium ".concat(isActive('/dashboard')
                    ? 'bg-primary-50 border-primary-500 text-primary-700'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300')} onClick={function () { return setMobileMenuOpen(false); }}>
                  სამუშაო სივრცე
                </link_1.default>)}
            </div>
            
            {/* Mobile auth section */}
            <div className="pt-4 pb-3 border-t border-gray-200">
              {!user && (<div className="space-y-3 px-3">
                  <link_1.default href="/auth/login" className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md" onClick={function () { return setMobileMenuOpen(false); }}>
                    შესვლა / რეგისტრაცია
                  </link_1.default>
                  
                  {authError && (<div className="p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                      {authError}
                    </div>)}
                  
                  <button onClick={function () {
                    router.push('/auth/login');
                    setMobileMenuOpen(false);
                }} className="w-full flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    შესვლა Google ანგარიშით
                  </button>
                </div>)}
              
              {user && (<div className="px-3 space-y-3">
                  <div className="flex items-center space-x-3 px-4 py-2">
                    {user.picture && (<image_1.default src={user.picture} alt="profile" width={40} height={40} className="rounded-full"/>)}
                    <div>
                      <div className="text-base font-medium text-gray-800">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  
                  <link_1.default href="/profile" className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md" onClick={function () { return setMobileMenuOpen(false); }}>
                    პროფილი
                  </link_1.default>
                  
                  <button onClick={function () {
                    handleLogout();
                    setMobileMenuOpen(false);
                }} className="w-full text-left px-4 py-2 text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md">
                    გამოსვლა
                  </button>
                </div>)}
            </div>
          </div>)}
      </nav>

      <RegistrationModal_1.default open={showRegistration} onClose={function () {
            setShowRegistration(false);
            setPendingIdToken(null);
            setPendingUserInfo(null);
            setAuthError('');
        }} onSubmit={handleRegistrationSubmit} userInfo={pendingUserInfo} loading={loading} error={authError}/>
    </>);
}
