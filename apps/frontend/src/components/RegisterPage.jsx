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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RegisterPage;
var react_1 = __importStar(require("react"));
var material_1 = require("@mui/material");
var icons_material_1 = require("@mui/icons-material");
var navigation_1 = require("next/navigation");
var google_1 = require("@react-oauth/google");
var api_1 = require("../services/api");
var authStore_1 = require("../store/authStore");
function RegisterPage(_a) {
    var _this = this;
    var onRegister = _a.onRegister;
    var router = (0, navigation_1.useRouter)();
    var searchParams = (0, navigation_1.useSearchParams)();
    var login = (0, authStore_1.useAuthStore)().login;
    var _b = (0, react_1.useState)({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        organization: '',
        position: '',
        personalNumber: '',
        phoneNumber: ''
    }), formData = _b[0], setFormData = _b[1];
    var _c = (0, react_1.useState)(false), loading = _c[0], setLoading = _c[1];
    var _d = (0, react_1.useState)(''), error = _d[0], setError = _d[1];
    var _e = (0, react_1.useState)(false), acceptTerms = _e[0], setAcceptTerms = _e[1];
    var _f = (0, react_1.useState)(false), isGoogleRegistration = _f[0], setIsGoogleRegistration = _f[1];
    var _g = (0, react_1.useState)(null), googleUserInfo = _g[0], setGoogleUserInfo = _g[1];
    // Check if this is a Google registration completion
    (0, react_1.useEffect)(function () {
        var fromGoogle = searchParams.get('from') === 'google';
        var userInfo = searchParams.get('userInfo');
        if (fromGoogle && userInfo) {
            try {
                var parsedUserInfo_1 = JSON.parse(decodeURIComponent(userInfo));
                setIsGoogleRegistration(true);
                setGoogleUserInfo(parsedUserInfo_1);
                setFormData(function (prev) { return (__assign(__assign({}, prev), { firstName: parsedUserInfo_1.given_name || '', lastName: parsedUserInfo_1.family_name || '', email: parsedUserInfo_1.email || '' })); });
            }
            catch (error) {
                console.error('Error parsing Google user info:', error);
            }
        }
    }, [searchParams]);
    var handleChange = function (e) {
        var _a;
        setFormData(__assign(__assign({}, formData), (_a = {}, _a[e.target.name] = e.target.value, _a)));
    };
    var handleEmailRegister = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var response, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    setLoading(true);
                    setError('');
                    // For Google registration, password is not required
                    if (!isGoogleRegistration) {
                        if (formData.password !== formData.confirmPassword) {
                            setError('პაროლები არ ემთხვევა');
                            setLoading(false);
                            return [2 /*return*/];
                        }
                        if (!formData.password) {
                            setError('პაროლი აუცილებელია');
                            setLoading(false);
                            return [2 /*return*/];
                        }
                    }
                    if (!acceptTerms) {
                        setError('საჭიროა წესებისა და პირობების მიღება');
                        setLoading(false);
                        return [2 /*return*/];
                    }
                    if (!formData.personalNumber) {
                        setError('პირადი ნომერი აუცილებელია');
                        setLoading(false);
                        return [2 /*return*/];
                    }
                    if (!formData.phoneNumber) {
                        setError('ტელეფონის ნომერი აუცილებელია');
                        setLoading(false);
                        return [2 /*return*/];
                    }
                    // Basic validation for personal number (11 digits)
                    if (!/^\d{11}$/.test(formData.personalNumber)) {
                        setError('პირადი ნომერი უნდა შეიცავდეს 11 ციფრს');
                        setLoading(false);
                        return [2 /*return*/];
                    }
                    // Basic validation for phone number
                    if (!/^\d{9,15}$/.test(formData.phoneNumber)) {
                        setError('ტელეფონის ნომერი უნდა შეიცავდეს 9-15 ციფრს');
                        setLoading(false);
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, api_1.authApi.register({
                            firstName: formData.firstName,
                            lastName: formData.lastName,
                            email: formData.email,
                            password: formData.password,
                            personalNumber: formData.personalNumber,
                            phoneNumber: formData.phoneNumber,
                            organization: formData.organization,
                            position: formData.position,
                        })];
                case 2:
                    response = _a.sent();
                    // Store in auth store
                    login(response);
                    if (onRegister) {
                        onRegister(response.user);
                    }
                    router.push('/dashboard');
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    setError(err_1.message || 'რეგისტრაციისას დაფიქსირდა შეცდომა');
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleGoogleRegister = (0, google_1.useGoogleLogin)({
        onSuccess: function (tokenResponse) { return __awaiter(_this, void 0, void 0, function () {
            var userInfoResponse, userInfo, userInfoParam, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, 5, 6]);
                        setLoading(true);
                        return [4 /*yield*/, fetch("https://www.googleapis.com/oauth2/v2/userinfo?access_token=".concat(tokenResponse.access_token), {
                                headers: {
                                    Authorization: "Bearer ".concat(tokenResponse.access_token),
                                    Accept: 'application/json'
                                }
                            })];
                    case 1:
                        userInfoResponse = _a.sent();
                        if (!userInfoResponse.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, userInfoResponse.json()];
                    case 2:
                        userInfo = _a.sent();
                        userInfoParam = encodeURIComponent(JSON.stringify(userInfo));
                        router.push("/auth/register?from=google&userInfo=".concat(userInfoParam));
                        _a.label = 3;
                    case 3: return [3 /*break*/, 6];
                    case 4:
                        error_1 = _a.sent();
                        console.error('Google registration error:', error_1);
                        setError('Google-ით რეგისტრაციისას დაფიქსირდა შეცდომა');
                        return [3 /*break*/, 6];
                    case 5:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        }); },
        onError: function () {
            setError('Google-ით რეგისტრაციისას დაფიქსირდა შეცდომა');
        }
    });
    return (<material_1.Box sx={{
            minHeight: '100vh',
            backgroundColor: '#f5f5f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: 4
        }}>
      <material_1.Container maxWidth="sm">
        <material_1.Paper elevation={3} sx={{ p: 4 }}>
          <material_1.Box sx={{ textAlign: 'center', mb: 4 }}>
            <icons_material_1.Shield sx={{ fontSize: 48, color: 'primary.main', mb: 2 }}/>
            <material_1.Typography variant="h4" gutterBottom>
              SabApp
            </material_1.Typography>
            <material_1.Typography variant="h6" color="text.secondary">
              {isGoogleRegistration ? 'რეგისტრაციის დასრულება' : 'რეგისტრაცია'}
            </material_1.Typography>
            {isGoogleRegistration && (<material_1.Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Google-ით ავტორიზაციისთვის საჭიროა დამატებითი ინფორმაცია
              </material_1.Typography>)}
          </material_1.Box>

          {error && (<material_1.Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </material_1.Alert>)}

          <material_1.Box component="form" onSubmit={handleEmailRegister} sx={{ mb: 3 }}>
            <material_1.Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <material_1.TextField fullWidth label="სახელი" name="firstName" value={formData.firstName} onChange={handleChange} required disabled={isGoogleRegistration}/>
              <material_1.TextField fullWidth label="გვარი" name="lastName" value={formData.lastName} onChange={handleChange} required disabled={isGoogleRegistration}/>
            </material_1.Box>
            
            <material_1.TextField fullWidth label="ელ. ფოსტა" type="email" name="email" value={formData.email} onChange={handleChange} required disabled={isGoogleRegistration} sx={{ mb: 2 }}/>
            
            <material_1.TextField fullWidth label="ორგანიზაცია" name="organization" value={formData.organization} onChange={handleChange} sx={{ mb: 2 }}/>
            
            <material_1.TextField fullWidth label="პოზიცია" name="position" value={formData.position} onChange={handleChange} sx={{ mb: 2 }}/>
            
            <material_1.TextField fullWidth label="პირადი ნომერი" name="personalNumber" value={formData.personalNumber} onChange={handleChange} required sx={{ mb: 2 }} helperText="11 ციფრი" inputProps={{ maxLength: 11, pattern: '[0-9]*' }}/>
            
            <material_1.TextField fullWidth label="ტელეფონის ნომერი" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required sx={{ mb: 2 }} helperText="მაგ: 555123456" inputProps={{ maxLength: 15 }}/>
            
            {!isGoogleRegistration && (<>
                <material_1.TextField fullWidth label="პაროლი" type="password" name="password" value={formData.password} onChange={handleChange} required sx={{ mb: 2 }}/>
                
                <material_1.TextField fullWidth label="პაროლის დადასტურება" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required sx={{ mb: 2 }}/>
              </>)}
            
            <material_1.FormControlLabel control={<material_1.Checkbox checked={acceptTerms} onChange={function (e) { return setAcceptTerms(e.target.checked); }} color="primary"/>} label={<material_1.Typography variant="body2">
                  ვეთანხმები{' '}
                  <material_1.Link href="/terms" sx={{ textDecoration: 'none' }}>
                    წესებსა და პირობებს
                  </material_1.Link>
                </material_1.Typography>} sx={{ mb: 3 }}/>
            
            <material_1.Button type="submit" fullWidth variant="contained" size="large" disabled={loading} sx={{ mb: 2 }}>
              {loading ? <material_1.CircularProgress size={24}/> : (isGoogleRegistration ? 'რეგისტრაციის დასრულება' : 'რეგისტრაცია')}
            </material_1.Button>
          </material_1.Box>

          {!isGoogleRegistration && (<>
              <material_1.Divider sx={{ my: 3 }}>
                <material_1.Typography variant="body2" color="text.secondary">
                  ან
                </material_1.Typography>
              </material_1.Divider>

              <material_1.Button fullWidth variant="outlined" size="large" startIcon={<icons_material_1.Google />} onClick={function () { return handleGoogleRegister(); }} disabled={loading} sx={{ mb: 3 }}>
                Google-ით რეგისტრაცია
              </material_1.Button>
            </>)}

          <material_1.Box sx={{ textAlign: 'center' }}>
            <material_1.Typography variant="body2" color="text.secondary">
              უკვე გაქვთ ანგარიში?{' '}
              <material_1.Link href="/auth/login" sx={{ cursor: 'pointer' }}>
                შესვლა
              </material_1.Link>
            </material_1.Typography>
          </material_1.Box>

          <material_1.Box sx={{ textAlign: 'center', mt: 3 }}>
            <material_1.Link onClick={function () { return router.push('/'); }} sx={{ cursor: 'pointer', color: 'text.secondary' }}>
              ← დაბრუნება მთავარ გვერდზე
            </material_1.Link>
          </material_1.Box>
        </material_1.Paper>
      </material_1.Container>
    </material_1.Box>);
}
