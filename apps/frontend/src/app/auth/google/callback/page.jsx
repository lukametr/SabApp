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
exports.default = GoogleCallbackPage;
var react_1 = require("react");
var navigation_1 = require("next/navigation");
var authStore_1 = require("../../../../store/authStore");
var api_1 = __importDefault(require("../../../../lib/api"));
function GoogleCallbackPage() {
    var _this = this;
    var router = (0, navigation_1.useRouter)();
    var searchParams = (0, navigation_1.useSearchParams)();
    var login = (0, authStore_1.useAuthStore)().login;
    var _a = (0, react_1.useState)('loading'), status = _a[0], setStatus = _a[1];
    var _b = (0, react_1.useState)(''), error = _b[0], setError = _b[1];
    (0, react_1.useEffect)(function () {
        var handleCallback = function () { return __awaiter(_this, void 0, void 0, function () {
            var code, state, storedState, response, err_1;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        code = searchParams.get('code');
                        state = searchParams.get('state');
                        storedState = localStorage.getItem('google_oauth_state');
                        if (!code) {
                            setError('Authorization code not found');
                            setStatus('error');
                            return [2 /*return*/];
                        }
                        if (!state || state !== storedState) {
                            setError('Invalid state parameter');
                            setStatus('error');
                            return [2 /*return*/];
                        }
                        // Clean up stored state
                        localStorage.removeItem('google_oauth_state');
                        return [4 /*yield*/, api_1.default.post('/auth/google/callback', {
                                code: code,
                                state: state,
                            })];
                    case 1:
                        response = _c.sent();
                        if (response.data.accessToken) {
                            login(response.data);
                            setStatus('success');
                            // Redirect to home page after successful login
                            setTimeout(function () {
                                router.push('/');
                            }, 2000);
                        }
                        else {
                            setError('Failed to authenticate with Google');
                            setStatus('error');
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _c.sent();
                        console.error('OAuth callback error:', err_1);
                        setError(((_b = (_a = err_1 === null || err_1 === void 0 ? void 0 : err_1.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Authentication failed');
                        setStatus('error');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        handleCallback();
    }, [searchParams, router, login]);
    if (status === 'loading') {
        return (<div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Google-ით ავტორიზაცია...</p>
        </div>
      </div>);
    }
    if (status === 'success') {
        return (<div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <p className="mt-4 text-green-600 font-semibold">წარმატებით შეხვედით!</p>
          <p className="mt-2 text-gray-600">მთავარ გვერდზე გადამისამართება...</p>
        </div>
      </div>);
    }
    return (<div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </div>
        <p className="mt-4 text-red-600 font-semibold">ავტორიზაციის შეცდომა</p>
        <p className="mt-2 text-gray-600">{error}</p>
        <button onClick={function () { return router.push('/'); }} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          მთავარ გვერდზე დაბრუნება
        </button>
      </div>
    </div>);
}
