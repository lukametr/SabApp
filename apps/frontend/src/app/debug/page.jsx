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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DebugPage;
var react_1 = require("react");
var authStore_1 = require("../../store/authStore");
function DebugPage() {
    var _this = this;
    var _a = (0, authStore_1.useAuthStore)(), user = _a.user, token = _a.token, loadFromStorage = _a.loadFromStorage;
    var _b = (0, react_1.useState)(null), localStorageData = _b[0], setLocalStorageData = _b[1];
    (0, react_1.useEffect)(function () {
        loadFromStorage();
        // Get localStorage data directly
        try {
            var storedUser = localStorage.getItem('user');
            var storedToken = localStorage.getItem('token');
            setLocalStorageData({
                user: storedUser ? JSON.parse(storedUser) : null,
                token: storedToken
            });
        }
        catch (error) {
            console.error('Error reading localStorage:', error);
        }
    }, []);
    var clearStorage = function () {
        localStorage.clear();
        window.location.reload();
    };
    var reLogin = function () { return __awaiter(_this, void 0, void 0, function () {
        var response, data, login, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, fetch('/api/auth/login', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                email: 'admin@saba.com',
                                password: 'admin123'
                            }),
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    console.log('Login response:', data);
                    login = authStore_1.useAuthStore.getState().login;
                    login(data);
                    window.location.reload();
                    return [3 /*break*/, 4];
                case 3:
                    console.error('Login failed:', response.status);
                    _a.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
                    console.error('Login error:', error_1);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    return (<div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>🔍 Admin Debug Page</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Auth Store Data:</h2>
        <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
          {JSON.stringify({ user: user, token: token ? 'exists' : 'null' }, null, 2)}
        </pre>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>localStorage Data:</h2>
        <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
          {JSON.stringify(localStorageData, null, 2)}
        </pre>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Role Check:</h2>
        <p>User exists: {user ? 'Yes' : 'No'}</p>
        <p>User role: {(user === null || user === void 0 ? void 0 : user.role) || 'undefined'}</p>
        <p>Is admin: {(user === null || user === void 0 ? void 0 : user.role) === 'admin' ? 'Yes' : 'No'}</p>
        <p>Role type: {typeof (user === null || user === void 0 ? void 0 : user.role)}</p>
      </div>

      <div>
        <button onClick={clearStorage} style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: '#ff6b6b',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
        }}>
          Clear Storage & Reload
        </button>
        
        <button onClick={reLogin} style={{
            padding: '10px 20px',
            backgroundColor: '#4ecdc4',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
        }}>
          Re-login as Admin
        </button>
      </div>
    </div>);
}
