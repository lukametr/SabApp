'use strict';
'use client';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  (function () {
    var ownKeys = function (o) {
      ownKeys =
        Object.getOwnPropertyNames ||
        function (o) {
          var ar = [];
          for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
          return ar;
        };
      return ownKeys(o);
    };
    return function (mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null)
        for (var k = ownKeys(mod), i = 0; i < k.length; i++)
          if (k[i] !== 'default') __createBinding(result, mod, k[i]);
      __setModuleDefault(result, mod);
      return result;
    };
  })();
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g = Object.create((typeof Iterator === 'function' ? Iterator : Object).prototype);
    return (
      (g.next = verb(0)),
      (g['throw'] = verb(1)),
      (g['return'] = verb(2)),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                    ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                    : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.default = LoginPage;
var react_1 = __importStar(require('react'));
var material_1 = require('@mui/material');
var icons_material_1 = require('@mui/icons-material');
var navigation_1 = require('next/navigation');
var api_1 = require('../services/api');
var authStore_1 = require('../store/authStore');
function LoginPage(_a) {
  var _this = this;
  var onLogin = _a.onLogin;
  var router = (0, navigation_1.useRouter)();
  var login = (0, authStore_1.useAuthStore)().login;
  var _b = (0, react_1.useState)(''),
    email = _b[0],
    setEmail = _b[1];
  var _c = (0, react_1.useState)(''),
    password = _c[0],
    setPassword = _c[1];
  var _d = (0, react_1.useState)(false),
    showPassword = _d[0],
    setShowPassword = _d[1];
  var _e = (0, react_1.useState)(false),
    loading = _e[0],
    setLoading = _e[1];
  var _f = (0, react_1.useState)(''),
    error = _f[0],
    setError = _f[1];
  var _g = (0, react_1.useState)(false),
    isGoogleAccount = _g[0],
    setIsGoogleAccount = _g[1];
  var handleEmailLogin = function (e) {
    return __awaiter(_this, void 0, void 0, function () {
      var response, err_1;
      var _a, _b, _c;
      return __generator(this, function (_d) {
        switch (_d.label) {
          case 0:
            e.preventDefault();
            setLoading(true);
            setError('');
            setIsGoogleAccount(false);
            _d.label = 1;
          case 1:
            _d.trys.push([1, 3, 4, 5]);
            console.log('🔐 Login attempt:', { email: email, passwordLength: password.length });
            console.log('🔐 API URL:', process.env.NEXT_PUBLIC_API_URL);
            return [
              4 /*yield*/,
              api_1.authApi.login({
                email: email,
                password: password,
              }),
            ];
          case 2:
            response = _d.sent();
            if (
              (response === null || response === void 0 ? void 0 : response.user) &&
              response.user.isEmailVerified === false
            ) {
              setError('გთხოვთ, დაადასტურეთ ელფოსტა ანგარიშის გასააქტიურებლად');
              setLoading(false);
              return [2 /*return*/];
            }
            console.log('🔐 Login response received:', {
              hasUser: !!(response === null || response === void 0 ? void 0 : response.user),
              hasToken: !!(response === null || response === void 0
                ? void 0
                : response.accessToken),
              userEmail:
                (_a = response === null || response === void 0 ? void 0 : response.user) === null ||
                _a === void 0
                  ? void 0
                  : _a.email,
            });
            // Store in auth store
            login(response);
            console.log('🔐 Auth store updated');
            if (onLogin) {
              onLogin(response.user);
            }
            console.log('🔐 Navigating to dashboard...');
            router.push('/dashboard');
            return [3 /*break*/, 5];
          case 3:
            err_1 = _d.sent();
            console.error('🔐 Login error:', err_1);
            console.error('🔐 Error details:', {
              message: err_1.message,
              stack: err_1.stack,
              response: err_1.response,
            });
            // Check if this is a Google-only account
            if (
              ((_c = (_b = err_1.response) === null || _b === void 0 ? void 0 : _b.data) === null ||
              _c === void 0
                ? void 0
                : _c.code) === 'GOOGLE_ACCOUNT_ONLY'
            ) {
              setIsGoogleAccount(true);
              setError(
                'ეს ანგარიში შექმნილია Google-ით. გთხოვთ, გამოიყენოთ "Google-ით შესვლა" ღილაკი.'
              );
            } else {
              setIsGoogleAccount(false);
              setError(err_1.message || 'შესვლისას დაფიქსირდა შეცდომა');
            }
            return [3 /*break*/, 5];
          case 4:
            setLoading(false);
            return [7 /*endfinally*/];
          case 5:
            return [2 /*return*/];
        }
      });
    });
  };
  var handleGoogleLogin = function () {
    try {
      console.log('🔧 Google Login - Starting redirect flow...');
      // Use same redirect flow as RegisterPage
      var baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
      var googleOAuthUrl = ''.concat(baseUrl, '/auth/google');
      console.log('🔧 Google Login - Redirecting to:', googleOAuthUrl);
      window.location.href = googleOAuthUrl;
    } catch (error) {
      console.error('Google login redirect error:', error);
      setError('Google-ით შესვლისას დაფიქსირდა შეცდომა');
    }
  };
  return (
    <material_1.Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <material_1.Container maxWidth="sm">
        <material_1.Paper elevation={3} sx={{ p: 4 }}>
          <material_1.Box sx={{ textAlign: 'center', mb: 4 }}>
            <icons_material_1.Shield sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <material_1.Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <img src="/logo-3.jpg" alt="logo" style={{ height: 56, objectFit: 'contain' }} />
            </material_1.Box>
            <material_1.Typography variant="h6" color="text.secondary">
              შესვლა სისტემაში
            </material_1.Typography>
          </material_1.Box>

          {error && (
            <material_1.Alert severity="error" sx={{ mb: 3 }}>
              {error}
              {isGoogleAccount && (
                <material_1.Box sx={{ mt: 2 }}>
                  <material_1.Button
                    fullWidth
                    variant="outlined"
                    startIcon={<icons_material_1.Google />}
                    onClick={handleGoogleLogin}
                    sx={{
                      color: '#4285f4',
                      borderColor: '#4285f4',
                      '&:hover': {
                        backgroundColor: 'rgba(66, 133, 244, 0.1)',
                        borderColor: '#4285f4',
                      },
                    }}
                  >
                    Google-ით შესვლა
                  </material_1.Button>
                </material_1.Box>
              )}
            </material_1.Alert>
          )}

          {/* Google Login Button - moved to top */}
          <material_1.Button
            fullWidth
            variant="outlined"
            size="large"
            startIcon={<icons_material_1.Google />}
            onClick={function () {
              return handleGoogleLogin();
            }}
            disabled={loading}
            sx={{
              mb: 3,
              color: '#4285f4',
              borderColor: '#4285f4',
              '&:hover': {
                backgroundColor: 'rgba(66, 133, 244, 0.1)',
                borderColor: '#4285f4',
              },
            }}
          >
            Google-ით შესვლა
          </material_1.Button>

          <material_1.Divider sx={{ my: 3 }}>
            <material_1.Typography variant="body2" color="text.secondary">
              ან ელ. ფოსტით
            </material_1.Typography>
          </material_1.Divider>

          <material_1.Box component="form" onSubmit={handleEmailLogin} sx={{ mb: 3 }}>
            <material_1.TextField
              fullWidth
              label={email ? '' : 'ელ. ფოსტა'}
              type="email"
              value={email}
              onChange={function (e) {
                return setEmail(e.target.value);
              }}
              required
              sx={{ mb: 2 }}
            />
            <material_1.TextField
              fullWidth
              label={password ? '' : 'პაროლი'}
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={function (e) {
                return setPassword(e.target.value);
              }}
              required
              sx={{ mb: 3 }}
              InputProps={{
                endAdornment: (
                  <material_1.InputAdornment position="end">
                    <material_1.IconButton
                      aria-label="toggle password visibility"
                      onClick={function () {
                        return setShowPassword(!showPassword);
                      }}
                      onMouseDown={function (e) {
                        return e.preventDefault();
                      }}
                      edge="end"
                    >
                      {showPassword ? (
                        <icons_material_1.VisibilityOff />
                      ) : (
                        <icons_material_1.Visibility />
                      )}
                    </material_1.IconButton>
                  </material_1.InputAdornment>
                ),
              }}
            />
            <material_1.Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mb: 2 }}
            >
              {loading ? <material_1.CircularProgress size={24} /> : 'შესვლა'}
            </material_1.Button>
          </material_1.Box>

          <material_1.Box sx={{ textAlign: 'center' }}>
            <material_1.Typography variant="body2" color="text.secondary">
              არ გაქვთ ანგარიში?{' '}
              <material_1.Link href="/auth/register" sx={{ cursor: 'pointer' }}>
                რეგისტრაცია
              </material_1.Link>
            </material_1.Typography>
          </material_1.Box>

          <material_1.Box sx={{ textAlign: 'center', mt: 3 }}>
            <material_1.Link
              onClick={function () {
                return router.push('/');
              }}
              sx={{ cursor: 'pointer', color: 'text.secondary' }}
            >
              ← დაბრუნება მთავარ გვერდზე
            </material_1.Link>
          </material_1.Box>
        </material_1.Paper>
      </material_1.Container>
    </material_1.Box>
  );
}
