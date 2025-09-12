'use strict';
'use client';
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
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
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.default = Navigation;
var link_1 = __importDefault(require('next/link'));
var navigation_1 = require('next/navigation');
var authStore_1 = require('../store/authStore');
var react_1 = require('react');
var navigation_2 = require('next/navigation');
var image_1 = __importDefault(require('next/image'));
var api_1 = __importDefault(require('../lib/api'));
function Navigation() {
  var _this = this;
  var pathname = (0, navigation_1.usePathname)();
  var router = (0, navigation_2.useRouter)();
  var _a = (0, authStore_1.useAuthStore)(),
    user = _a.user,
    logout = _a.logout,
    login = _a.login;
  var _b = (0, react_1.useState)(''),
    authError = _b[0],
    setAuthError = _b[1];
  var _c = (0, react_1.useState)(false),
    mobileMenuOpen = _c[0],
    setMobileMenuOpen = _c[1];
  var handleSmoothScroll = function (elementId) {
    var element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };
  
  // No need to call loadFromStorage here - handled by AuthProvider
  var isActive = function (path) {
    return pathname === path;
  };
  var handleLogout = function () {
    logout();
    router.push('/');
    router.refresh();
  };
  return (
    <>
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <link_1.default href="/" className="inline-flex items-center">
                  <img
                    src="/logo-3.jpg"
                    alt="logo"
                    style={{ height: '32px', objectFit: 'contain' }}
                  />
                </link_1.default>
              </div>
              {/* Desktop Menu */}
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {!user && (
                  <>
                    <link_1.default
                      href="/"
                      className={'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium '.concat(
                        isActive('/')
                          ? 'border-primary-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      )}
                    >
                      მთავარი
                    </link_1.default>
                    <button
                      onClick={function () {
                        return handleSmoothScroll('about');
                      }}
                      className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    >
                      ჩვენი მიზანი
                    </button>
                    <button
                      onClick={function () {
                        return handleSmoothScroll('demo');
                      }}
                      className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    >
                      ფორმების ნიმუშები
                    </button>
                    <button
                      onClick={function () {
                        return handleSmoothScroll('contact');
                      }}
                      className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    >
                      კავშირი
                    </button>
                  </>
                )}
                {user && (
                  <link_1.default
                    href="/dashboard"
                    className={'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium '.concat(
                      isActive('/dashboard')
                        ? 'border-primary-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    )}
                  >
                    სამუშაო სივრცე
                  </link_1.default>
                )}
              </div>
            </div>

            {/* Desktop Right Side */}
            <div className="hidden sm:flex sm:items-center sm:space-x-4">
              {!user && (
                <>
                  <link_1.default
                    href="/auth/login"
                    className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    შესვლა
                  </link_1.default>
                  <link_1.default
                    href="/auth/register"
                    className="px-3 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700"
                  >
                    რეგისტრაცია
                  </link_1.default>
                </>
              )}
              {user && (
                <>
                  <link_1.default href="/profile" className="flex items-center space-x-2">
                    {user.picture && (
                      <image_1.default
                        src={user.picture}
                        alt="profile"
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    )}
                    <span className="font-medium text-gray-700 hidden lg:inline">{user.name}</span>
                  </link_1.default>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 rounded bg-red-500 text-white hover:bg-red-600 text-sm"
                  >
                    გამოსვლა
                  </button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="sm:hidden flex items-center">
              <button
                onClick={function () {
                  return setMobileMenuOpen(!mobileMenuOpen);
                }}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {!mobileMenuOpen ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {!user && (
                <>
                  {' '}
                  <link_1.default
                    href="/"
                    className={'block pl-3 pr-4 py-2 border-l-4 text-base font-medium '.concat(
                      isActive('/')
                        ? 'bg-primary-50 border-primary-500 text-primary-700'
                        : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300'
                    )}
                    onClick={function () {
                      return setMobileMenuOpen(false);
                    }}
                  >
                    მთავარი
                  </link_1.default>
                  <button
                    onClick={function () {
                      handleSmoothScroll('about');
                      setMobileMenuOpen(false);
                    }}
                    className="border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left"
                  >
                    ჩვენი მიზანი
                  </button>
                  <button
                    onClick={function () {
                      handleSmoothScroll('demo');
                      setMobileMenuOpen(false);
                    }}
                    className="border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left"
                  >
                    ფორმების ნიმუშები
                  </button>
                  <button
                    onClick={function () {
                      handleSmoothScroll('contact');
                      setMobileMenuOpen(false);
                    }}
                    className="border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left"
                  >
                    კავშირი
                  </button>
                </>
              )}
              {user && (
                <link_1.default
                  href="/dashboard"
                  className={'block pl-3 pr-4 py-2 border-l-4 text-base font-medium '.concat(
                    isActive('/dashboard')
                      ? 'bg-primary-50 border-primary-500 text-primary-700'
                      : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300'
                  )}
                  onClick={function () {
                    return setMobileMenuOpen(false);
                  }}
                >
                  სამუშაო სივრცე
                </link_1.default>
              )}
            </div>

            {/* Mobile auth section */}
            <div className="pt-4 pb-3 border-t border-gray-200">
              {!user && (
                <div className="space-y-3 px-3">
                  <link_1.default
                    href="/auth/login"
                    className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                    onClick={function () {
                      return setMobileMenuOpen(false);
                    }}
                  >
                    შესვლა / რეგისტრაცია
                  </link_1.default>

                  {authError && (
                    <div className="p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                      {authError}
                    </div>
                  )}
                </div>
              )}

              {user && (
                <div className="px-3 space-y-3">
                  <div className="flex items-center space-x-3 px-4 py-2">
                    {user.picture && (
                      <image_1.default
                        src={user.picture}
                        alt="profile"
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    )}
                    <div>
                      <div className="text-base font-medium text-gray-800">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>

                  <link_1.default
                    href="/profile"
                    className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                    onClick={function () {
                      return setMobileMenuOpen(false);
                    }}
                  >
                    პროფილი
                  </link_1.default>

                  <button
                    onClick={function () {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
                  >
                    გამოსვლა
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
