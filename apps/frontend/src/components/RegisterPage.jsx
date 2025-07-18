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
// minor: trigger redeploy
var react_1 = __importStar(require("react"));
var material_1 = require("@mui/material");
var icons_material_1 = require("@mui/icons-material");
var navigation_1 = require("next/navigation");
var auth_service_1 = require("../services/auth.service");
var authStore_1 = require("../store/authStore");
// Get Google Client ID from env (runtime check)
var clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
console.log('[Google OAuth] NEXT_PUBLIC_GOOGLE_CLIENT_ID:', clientId);
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
    }), formData = _b[0], setFormData = _b[1];
    var _c = (0, react_1.useState)(false), loading = _c[0], setLoading = _c[1];
    var _d = (0, react_1.useState)(''), error = _d[0], setError = _d[1];
    var _e = (0, react_1.useState)(''), success = _e[0], setSuccess = _e[1];
    var _f = (0, react_1.useState)(false), acceptTerms = _f[0], setAcceptTerms = _f[1];
    var _g = (0, react_1.useState)(false), showPassword = _g[0], setShowPassword = _g[1];
    var _h = (0, react_1.useState)(false), showConfirmPassword = _h[0], setShowConfirmPassword = _h[1];
    // No Google registration completion logic needed with NextAuth
    var handleChange = function (e) {
        var _a;
        setFormData(__assign(__assign({}, formData), (_a = {}, _a[e.target.name] = e.target.value, _a)));
    };
    var handleEmailRegister = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    setLoading(true);
                    setError('');
                    if (!acceptTerms) {
                        setError('საჭიროა წესებისა და პირობების მიღება');
                        setLoading(false);
                        return [2 /*return*/];
                    }
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
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    // პირველ ეტაპზე registration backend-ზე
                    return [4 /*yield*/, auth_service_1.authService.register({
                            firstName: formData.firstName,
                            lastName: formData.lastName,
                            email: formData.email,
                            password: formData.password,
                            organization: formData.organization,
                            position: formData.position,
                        })];
                case 2:
                    // პირველ ეტაპზე registration backend-ზე
                    _a.sent();
                    // მეორე ეტაპზე login backend service-ით
                    return [4 /*yield*/, auth_service_1.authService.signIn(formData.email, formData.password)];
                case 3:
                    // მეორე ეტაპზე login backend service-ით
                    _a.sent();
                    setSuccess('რეგისტრაცია და შესვლა წარმატებით დასრულდა!');
                    setTimeout(function () {
                        router.push('/dashboard');
                    }, 1000);
                    return [3 /*break*/, 6];
                case 4:
                    err_1 = _a.sent();
                    setError(err_1.message || 'რეგისტრაციისას დაფიქსირდა შეცდომა');
                    return [3 /*break*/, 6];
                case 5:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    // Google რეგისტრაცია/შესვლა უკაცრავად Backend-თან
    var handleGoogleRegister = function () {
        var _a;
        // Railway production URL detection
        var baseUrl = ((_a = process.env.NEXT_PUBLIC_API_URL) === null || _a === void 0 ? void 0 : _a.replace('/api', '')) || window.location.origin;
        var googleOAuthUrl = "".concat(baseUrl, "/api/auth/google");
        console.log('[Google OAuth] Redirecting to:', googleOAuthUrl);
        window.location.href = googleOAuthUrl;
    };
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
              რეგისტრაცია
            </material_1.Typography>
          </material_1.Box>


          {error && (<material_1.Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </material_1.Alert>)}
          {!clientId && (<material_1.Alert severity="error" sx={{ mb: 3 }}>
              Google რეგისტრაცია მიუწვდომელია: NEXT_PUBLIC_GOOGLE_CLIENT_ID არ არის ხელმისაწვდომი გარემოში!<br />
              გთხოვ შეამოწმე გარემოს ცვლადი deployment settings-ში.
            </material_1.Alert>)}
          {success && (<material_1.Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </material_1.Alert>)}

          <material_1.Box component="form" onSubmit={handleEmailRegister} sx={{ mb: 3 }}>
            <material_1.Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <material_1.TextField fullWidth label={formData.firstName ? "" : "სახელი"} name="firstName" value={formData.firstName} onChange={handleChange} required autoComplete="given-name"/>
              <material_1.TextField fullWidth label={formData.lastName ? "" : "გვარი"} name="lastName" value={formData.lastName} onChange={handleChange} required autoComplete="family-name"/>
            </material_1.Box>
            
            <material_1.TextField fullWidth label={formData.email ? "" : "ელ. ფოსტა"} type="email" name="email" value={formData.email} onChange={handleChange} required sx={{ mb: 2 }} autoComplete="email"/>
            
            <material_1.TextField fullWidth label={formData.organization ? "" : "ორგანიზაცია"} name="organization" value={formData.organization} onChange={handleChange} sx={{ mb: 2 }} autoComplete="organization"/>
            
            <material_1.TextField fullWidth label={formData.position ? "" : "პოზიცია"} name="position" value={formData.position} onChange={handleChange} sx={{ mb: 2 }} autoComplete="organization-title"/>
            
            {/* Password fields - always shown for credentials registration */}
            <>
              <material_1.TextField fullWidth label={formData.password ? "" : "პაროლი"} type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} required sx={{ mb: 2 }} autoComplete="new-password" InputProps={{
            endAdornment: (<material_1.InputAdornment position="end">
                        <material_1.IconButton aria-label="toggle password visibility" onClick={function () { return setShowPassword(!showPassword); }} edge="end">
                          {showPassword ? <icons_material_1.VisibilityOff /> : <icons_material_1.Visibility />}
                        </material_1.IconButton>
                      </material_1.InputAdornment>),
        }}/>
                
                <material_1.TextField fullWidth label={formData.confirmPassword ? "" : "პაროლის დადასტურება"} type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required sx={{ mb: 2 }} autoComplete="new-password" InputProps={{
            endAdornment: (<material_1.InputAdornment position="end">
                        <material_1.IconButton aria-label="toggle confirm password visibility" onClick={function () { return setShowConfirmPassword(!showConfirmPassword); }} edge="end">
                          {showConfirmPassword ? <icons_material_1.VisibilityOff /> : <icons_material_1.Visibility />}
                        </material_1.IconButton>
                      </material_1.InputAdornment>),
        }}/>
              </>
            
            <material_1.FormControlLabel control={<material_1.Checkbox checked={acceptTerms} onChange={function (e) { return setAcceptTerms(e.target.checked); }} color="primary"/>} label={<material_1.Typography variant="body2">
                  ვეთანხმები{' '}
                  <material_1.Link href="/terms" sx={{ textDecoration: 'none' }}>
                    წესებსა და პირობებს
                  </material_1.Link>
                </material_1.Typography>} sx={{ mb: 3 }}/>
            
            <material_1.Button type="submit" fullWidth variant="contained" size="large" disabled={loading} sx={{ mb: 2 }}>
              {loading ? <material_1.CircularProgress size={24}/> : 'რეგისტრაცია'}
            </material_1.Button>
          </material_1.Box>

          <material_1.Divider sx={{ my: 3 }}>
            <material_1.Typography variant="body2" color="text.secondary">
              ან
            </material_1.Typography>
          </material_1.Divider>

          {/* Google Registration Button - moved back to bottom */}
          <material_1.Button fullWidth variant="outlined" size="large" startIcon={<icons_material_1.Google />} onClick={function () {
            console.log('🔧 Google Register Button Clicked - Starting...');
            console.log('🔧 Google Register Button Clicked - clientId:', clientId);
            console.log('🔧 Google Register Button Clicked - loading:', loading);
            handleGoogleRegister();
        }} disabled={loading || !clientId} sx={{
            mb: 3,
            color: '#4285f4',
            borderColor: '#4285f4',
            '&:hover': {
                backgroundColor: 'rgba(66, 133, 244, 0.1)',
                borderColor: '#4285f4',
            },
        }}>
            Google-ით რეგისტრაცია
          </material_1.Button>

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
