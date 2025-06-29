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
exports.default = Navigation;
var link_1 = __importDefault(require("next/link"));
var navigation_1 = require("next/navigation");
var authStore_1 = require("../store/authStore");
var react_1 = require("react");
var navigation_2 = require("next/navigation");
var google_1 = require("@react-oauth/google");
var image_1 = __importDefault(require("next/image"));
var api_1 = __importDefault(require("../lib/api"));
var RegistrationForm_1 = __importDefault(require("./RegistrationForm"));
function Navigation() {
    var _this = this;
    var pathname = (0, navigation_1.usePathname)();
    var router = (0, navigation_2.useRouter)();
    var _a = (0, authStore_1.useAuthStore)(), user = _a.user, logout = _a.logout, login = _a.login, loadFromStorage = _a.loadFromStorage;
    var _b = (0, react_1.useState)(false), showRegistration = _b[0], setShowRegistration = _b[1];
    var _c = (0, react_1.useState)(null), pendingIdToken = _c[0], setPendingIdToken = _c[1];
    var _d = (0, react_1.useState)(false), loading = _d[0], setLoading = _d[1];
    (0, react_1.useEffect)(function () {
        loadFromStorage();
    }, [loadFromStorage]);
    var isActive = function (path) { return pathname === path; };
    var handleGoogleSuccess = function (credentialResponse) { return __awaiter(_this, void 0, void 0, function () {
        var idToken, res, err_1, error, err_2, error;
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    _j.trys.push([0, 5, , 6]);
                    idToken = credentialResponse.credential;
                    if (!idToken) {
                        alert('Google ავტორიზაციის შეცდომა: ტოკენი ვერ მოიძებნა');
                        return [2 /*return*/];
                    }
                    _j.label = 1;
                case 1:
                    _j.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, api_1.default.post('/auth/google', {
                            idToken: idToken,
                            personalNumber: '',
                            phoneNumber: '',
                        })];
                case 2:
                    res = _j.sent();
                    login(res.data);
                    router.refresh();
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _j.sent();
                    error = err_1;
                    if (((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.status) === 409 && ((_d = (_c = (_b = error === null || error === void 0 ? void 0 : error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) === null || _d === void 0 ? void 0 : _d.includes('Personal number'))) {
                        // User doesn't exist, show registration form
                        setPendingIdToken(idToken);
                        setShowRegistration(true);
                    }
                    else {
                        alert('ავტორიზაციის შეცდომა: ' + (((_f = (_e = error === null || error === void 0 ? void 0 : error.response) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.message) || (error === null || error === void 0 ? void 0 : error.message) || 'უცნობი შეცდომა'));
                    }
                    return [3 /*break*/, 4];
                case 4: return [3 /*break*/, 6];
                case 5:
                    err_2 = _j.sent();
                    error = err_2;
                    alert('ავტორიზაციის შეცდომა: ' + (((_h = (_g = error === null || error === void 0 ? void 0 : error.response) === null || _g === void 0 ? void 0 : _g.data) === null || _h === void 0 ? void 0 : _h.message) || (error === null || error === void 0 ? void 0 : error.message) || 'უცნობი შეცდომა'));
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var handleRegistrationSubmit = function (personalNumber, phoneNumber) { return __awaiter(_this, void 0, void 0, function () {
        var res, err_3, error;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!pendingIdToken)
                        return [2 /*return*/];
                    setLoading(true);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, api_1.default.post('/auth/google', {
                            idToken: pendingIdToken,
                            personalNumber: personalNumber,
                            phoneNumber: phoneNumber,
                        })];
                case 2:
                    res = _c.sent();
                    login(res.data);
                    setShowRegistration(false);
                    setPendingIdToken(null);
                    router.refresh();
                    return [3 /*break*/, 5];
                case 3:
                    err_3 = _c.sent();
                    error = err_3;
                    alert('რეგისტრაციის შეცდომა: ' + (((_b = (_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || (error === null || error === void 0 ? void 0 : error.message) || 'უცნობი შეცდომა'));
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
                  SabaP
                </link_1.default>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <link_1.default href="/" className={"inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ".concat(isActive('/')
            ? 'border-primary-500 text-gray-900'
            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700')}>
                  მთავარი
                </link_1.default>
                <link_1.default href="/documents" className={"inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ".concat(isActive('/documents')
            ? 'border-primary-500 text-gray-900'
            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700')}>
                  დოკუმენტები
                </link_1.default>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {!user && (<google_1.GoogleLogin onSuccess={handleGoogleSuccess} onError={function () { return alert('Google ავტორიზაციის შეცდომა'); }} useOneTap text="signin_with" shape="pill" width="180" locale="ka"/>)}
              {user && (<>
                  <link_1.default href="/profile" className="flex items-center space-x-2">
                    {user.picture && (<image_1.default src={user.picture} alt="profile" width={32} height={32} className="rounded-full"/>)}
                    <span className="font-medium text-gray-700">{user.name}</span>
                  </link_1.default>
                  <button onClick={handleLogout} className="ml-2 px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600">
                    გამოსვლა
                  </button>
                </>)}
            </div>
          </div>
        </div>
      </nav>

      <RegistrationForm_1.default open={showRegistration} onClose={function () {
            setShowRegistration(false);
            setPendingIdToken(null);
        }} onSubmit={handleRegistrationSubmit} loading={loading}/>
    </>);
}
