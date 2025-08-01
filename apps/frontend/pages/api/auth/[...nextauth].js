"use strict";
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
var next_auth_1 = __importDefault(require("next-auth"));
var google_1 = __importDefault(require("next-auth/providers/google"));
var credentials_1 = __importDefault(require("next-auth/providers/credentials"));
exports.default = (0, next_auth_1.default)({
    providers: [
        (0, google_1.default)({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        (0, credentials_1.default)({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email', placeholder: 'your@email.com' },
                password: { label: 'Password', type: 'password' },
            },
            authorize: function (credentials) {
                return __awaiter(this, void 0, void 0, function () {
                    var res, user;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, fetch("".concat(process.env.NEXT_PUBLIC_API_URL || '', "/auth/login"), {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        email: credentials === null || credentials === void 0 ? void 0 : credentials.email,
                                        password: credentials === null || credentials === void 0 ? void 0 : credentials.password,
                                    }),
                                })];
                            case 1:
                                res = _a.sent();
                                return [4 /*yield*/, res.json()];
                            case 2:
                                user = _a.sent();
                                if (res.ok && user) {
                                    return [2 /*return*/, user];
                                }
                                return [2 /*return*/, null];
                        }
                    });
                });
            },
        }),
    ],
    callbacks: {
        jwt: function (_a) {
            return __awaiter(this, arguments, void 0, function (_b) {
                var response, backendUser, errorData, error_1;
                var token = _b.token, user = _b.user, account = _b.account, profile = _b.profile;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (!(account && account.provider === 'google' && profile)) return [3 /*break*/, 8];
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 7, , 8]);
                            console.log('NextAuth JWT: Syncing Google user with backend:', profile.email);
                            return [4 /*yield*/, fetch("".concat(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:10000/api', "/auth/google"), {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        email: profile.email,
                                        name: profile.name,
                                        picture: profile.picture,
                                        googleId: profile.sub,
                                    }),
                                })];
                        case 2:
                            response = _c.sent();
                            if (!response.ok) return [3 /*break*/, 4];
                            return [4 /*yield*/, response.json()];
                        case 3:
                            backendUser = _c.sent();
                            console.log('NextAuth JWT: Backend sync successful');
                            token.id = backendUser.user.id || backendUser.user._id;
                            token.email = backendUser.user.email;
                            token.name = backendUser.user.name;
                            token.picture = backendUser.user.picture;
                            token.role = backendUser.user.role;
                            token.backendSynced = true;
                            return [3 /*break*/, 6];
                        case 4:
                            console.error('NextAuth JWT: Backend sync failed with status:', response.status);
                            return [4 /*yield*/, response.text()];
                        case 5:
                            errorData = _c.sent();
                            console.error('NextAuth JWT: Backend error:', errorData);
                            // Don't throw error, just mark as not synced
                            token.backendSynced = false;
                            token.error = 'Backend sync failed';
                            _c.label = 6;
                        case 6: return [3 /*break*/, 8];
                        case 7:
                            error_1 = _c.sent();
                            console.error('NextAuth JWT: Error syncing Google user with backend:', error_1);
                            token.backendSynced = false;
                            token.error = 'Backend sync error';
                            return [3 /*break*/, 8];
                        case 8:
                            if (user) {
                                token.id = user.id || user._id;
                                token.email = user.email;
                                token.name = user.name;
                                token.picture = user.picture;
                                token.role = user.role;
                            }
                            return [2 /*return*/, token];
                    }
                });
            });
        },
        session: function (_a) {
            return __awaiter(this, arguments, void 0, function (_b) {
                var session = _b.session, token = _b.token;
                return __generator(this, function (_c) {
                    session.user.id = token.id;
                    session.user.role = token.role;
                    session.user.picture = token.picture;
                    session.user.backendSynced = token.backendSynced;
                    return [2 /*return*/, session];
                });
            });
        },
    },
    pages: {
        signIn: '/auth/login',
        error: '/auth/error',
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
});
