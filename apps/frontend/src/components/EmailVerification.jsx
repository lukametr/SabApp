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
exports.default = EmailVerification;
var react_1 = __importStar(require('react'));
var material_1 = require('@mui/material');
var icons_material_1 = require('@mui/icons-material');
var navigation_1 = require('next/navigation');
var api_1 = require('../services/api');
function EmailVerification() {
  var _this = this;
  var router = (0, navigation_1.useRouter)();
  var searchParams = (0, navigation_1.useSearchParams)();
  var _a = (0, react_1.useState)(true),
    loading = _a[0],
    setLoading = _a[1];
  var _b = (0, react_1.useState)(false),
    success = _b[0],
    setSuccess = _b[1];
  var _c = (0, react_1.useState)(''),
    error = _c[0],
    setError = _c[1];
  var token = searchParams.get('token');
  (0, react_1.useEffect)(
    function () {
      if (token) {
        verifyEmail();
      } else {
        setError('ვერიფიკაციის ტოკენი არ მოიძებნა');
        setLoading(false);
      }
    },
    [token]
  );
  var verifyEmail = function () {
    return __awaiter(_this, void 0, void 0, function () {
      var response, err_1;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2, 3, 4]);
            return [4 /*yield*/, api_1.authApi.verifyEmail(token)];
          case 1:
            response = _a.sent();
            if (response.success) {
              setSuccess(true);
            } else {
              setError('ვერიფიკაცია ვერ შესრულდა');
            }
            return [3 /*break*/, 4];
          case 2:
            err_1 = _a.sent();
            console.error('Email verification error:', err_1);
            setError(err_1.message || 'ვერიფიკაციისას დაფიქსირდა შეცდომა');
            return [3 /*break*/, 4];
          case 3:
            setLoading(false);
            return [7 /*endfinally*/];
          case 4:
            return [2 /*return*/];
        }
      });
    });
  };
  return (
    <material_1.Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <material_1.Container maxWidth="sm">
        <material_1.Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <icons_material_1.Shield sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <material_1.Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <img src="/logo-3.jpg" alt="logo" style={{ height: 56, objectFit: 'contain' }} />
          </material_1.Box>
          <material_1.Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            ელ. ფოსტის ვერიფიკაცია
          </material_1.Typography>

          {loading && (
            <material_1.Box>
              <material_1.CircularProgress sx={{ mb: 2 }} />
              <material_1.Typography>მიმდინარეობს ვერიფიკაცია...</material_1.Typography>
            </material_1.Box>
          )}

          {success && (
            <material_1.Box>
              <icons_material_1.CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
              <material_1.Alert severity="success" sx={{ mb: 3 }}>
                ელ. ფოსტა წარმატებით დადასტურდა! ახლა შეგიძლიათ შეხვიდეთ სისტემაში.
              </material_1.Alert>
              <material_1.Button
                variant="contained"
                size="large"
                onClick={function () {
                  return router.push('/auth/login');
                }}
                sx={{ mr: 2 }}
              >
                შესვლა
              </material_1.Button>
              <material_1.Button
                variant="outlined"
                size="large"
                onClick={function () {
                  return router.push('/');
                }}
              >
                მთავარი გვერდი
              </material_1.Button>
            </material_1.Box>
          )}

          {error && (
            <material_1.Box>
              <icons_material_1.Error sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
              <material_1.Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </material_1.Alert>
              <material_1.Button
                variant="outlined"
                size="large"
                onClick={function () {
                  return router.push('/auth/register');
                }}
                sx={{ mr: 2 }}
              >
                რეგისტრაცია
              </material_1.Button>
              <material_1.Button
                variant="outlined"
                size="large"
                onClick={function () {
                  return router.push('/');
                }}
              >
                მთავარი გვერდი
              </material_1.Button>
            </material_1.Box>
          )}
        </material_1.Paper>
      </material_1.Container>
    </material_1.Box>
  );
}
