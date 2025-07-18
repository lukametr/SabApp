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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DebugPage;
var react_1 = require("react");
function DebugPage() {
    var _this = this;
    var _a;
    var _b = (0, react_1.useState)([]), logs = _b[0], setLogs = _b[1];
    var _c = (0, react_1.useState)(''), googleUrl = _c[0], setGoogleUrl = _c[1];
    var addLog = function (message) {
        var timestamp = new Date().toLocaleTimeString();
        setLogs(function (prev) { return __spreadArray(__spreadArray([], prev, true), ["[".concat(timestamp, "] ").concat(message)], false); });
    };
    var testGoogleOAuth = function () { return __awaiter(_this, void 0, void 0, function () {
        var response, location_1, text, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    addLog('🔧 Testing Google OAuth URL...');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch('/api/auth/google', {
                            method: 'GET',
                            redirect: 'manual'
                        })];
                case 2:
                    response = _a.sent();
                    addLog("\uD83D\uDCE1 Response status: ".concat(response.status));
                    addLog("\uD83D\uDCE1 Response type: ".concat(response.type));
                    if (response.status === 302) {
                        location_1 = response.headers.get('Location');
                        if (location_1) {
                            setGoogleUrl(location_1);
                            addLog("\uD83D\uDD17 Redirect URL: ".concat(location_1.substring(0, 100), "..."));
                        }
                    }
                    return [4 /*yield*/, response.text()];
                case 3:
                    text = _a.sent();
                    addLog("\uD83D\uDCC4 Response body: ".concat(text.substring(0, 200), "..."));
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    addLog("\u274C Error: ".concat(error_1.message));
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var testDirectRedirect = function () {
        addLog('🔄 Testing direct redirect...');
        var url = "".concat(process.env.NEXT_PUBLIC_API_URL, "/auth/google");
        addLog("\uD83C\uDF10 Redirecting to: ".concat(url));
        window.location.href = url;
    };
    var testManualOAuth = function () {
        if (googleUrl) {
            addLog('🎯 Opening Google OAuth URL manually...');
            window.location.href = googleUrl;
        }
        else {
            addLog('❌ No Google URL available. Run test first.');
        }
    };
    var clearLogs = function () {
        setLogs([]);
    };
    var testBackendHealth = function () { return __awaiter(_this, void 0, void 0, function () {
        var response, data, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    addLog('🏥 Testing backend health...');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch("".concat(process.env.NEXT_PUBLIC_API_URL, "/api/debug"))];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    addLog("\u2705 Backend status: ".concat(response.status));
                    addLog("\uD83D\uDCCA Backend response: ".concat(JSON.stringify(data).substring(0, 200), "..."));
                    return [3 /*break*/, 5];
                case 4:
                    error_2 = _a.sent();
                    addLog("\u274C Backend error: ".concat(error_2.message));
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    (0, react_1.useEffect)(function () {
        var _a;
        addLog('🚀 Debug page loaded');
        addLog("\uD83D\uDD27 API URL: ".concat(process.env.NEXT_PUBLIC_API_URL));
        addLog("\uD83D\uDD11 Google Client ID: ".concat((_a = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) === null || _a === void 0 ? void 0 : _a.substring(0, 20), "..."));
    }, []);
    return (<div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Google OAuth Debug</h1>
        
        {/* Control Panel */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button onClick={testBackendHealth} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Test Backend Health
            </button>
            
            <button onClick={testGoogleOAuth} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Test OAuth URL
            </button>
            
            <button onClick={testDirectRedirect} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
              Direct Redirect
            </button>
            
            <button onClick={testManualOAuth} className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700" disabled={!googleUrl}>
              Manual OAuth
            </button>
          </div>
          
          <div className="mt-4">
            <button onClick={clearLogs} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
              Clear Logs
            </button>
          </div>
        </div>

        {/* Environment Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Environment Info</h2>
          <div className="space-y-2 text-sm font-mono">
            <div><strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL}</div>
            <div><strong>Google Client ID:</strong> {(_a = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) === null || _a === void 0 ? void 0 : _a.substring(0, 30)}...</div>
            <div><strong>Environment:</strong> {process.env.NODE_ENV}</div>
            <div><strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'N/A'}</div>
          </div>
        </div>

        {/* Logs */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Debug Logs</h2>
          <div className="bg-black text-green-400 p-4 rounded font-mono text-sm h-96 overflow-y-scroll">
            {logs.length === 0 ? (<div className="text-gray-500">No logs yet...</div>) : (logs.map(function (log, index) { return (<div key={index} className="mb-1">
                  {log}
                </div>); }))}
          </div>
        </div>

        {/* Google URL Display */}
        {googleUrl && (<div className="bg-white rounded-lg shadow p-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">Generated Google OAuth URL</h2>
            <div className="bg-gray-100 p-4 rounded text-sm break-all">
              {googleUrl}
            </div>
          </div>)}
      </div>
    </div>);
}
