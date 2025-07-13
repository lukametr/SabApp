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
exports.default = AdminPanel;
var react_1 = require("react");
var authStore_1 = require("../../store/authStore");
var navigation_1 = require("next/navigation");
function AdminPanel() {
    var _this = this;
    var _a = (0, authStore_1.useAuthStore)(), user = _a.user, token = _a.token;
    var router = (0, navigation_1.useRouter)();
    var _b = (0, react_1.useState)([]), users = _b[0], setUsers = _b[1];
    var _c = (0, react_1.useState)(true), loading = _c[0], setLoading = _c[1];
    var _d = (0, react_1.useState)(null), selectedUser = _d[0], setSelectedUser = _d[1];
    var _e = (0, react_1.useState)(false), showGrantModal = _e[0], setShowGrantModal = _e[1];
    var _f = (0, react_1.useState)({
        days: 30,
        paymentAmount: 0,
        paymentNote: ''
    }), grantForm = _f[0], setGrantForm = _f[1];
    // Check if user is authenticated
    (0, react_1.useEffect)(function () {
        console.log('🔍 Admin page - user check:', { user: user, role: user === null || user === void 0 ? void 0 : user.role, isAdmin: (user === null || user === void 0 ? void 0 : user.role) === 'admin' });
        if (!user || !token) {
            console.log('⚠️ No user or token found, redirecting to dashboard');
            router.push('/dashboard');
            return;
        }
        // For now, allow any authenticated user to access admin panel for debugging
        console.log('✅ User is authenticated, allowing access');
    }, [user, token, router]);
    // Load users with subscription info
    (0, react_1.useEffect)(function () {
        var loadUsers = function () { return __awaiter(_this, void 0, void 0, function () {
            var response, data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, 6, 7]);
                        return [4 /*yield*/, fetch('/api/subscription/users', {
                                headers: {
                                    'Authorization': "Bearer ".concat(token),
                                    'Content-Type': 'application/json',
                                },
                            })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        setUsers(data.data || []);
                        return [3 /*break*/, 4];
                    case 3:
                        console.error('Failed to load users');
                        _a.label = 4;
                    case 4: return [3 /*break*/, 7];
                    case 5:
                        error_1 = _a.sent();
                        console.error('Error loading users:', error_1);
                        return [3 /*break*/, 7];
                    case 6:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        }); };
        if (token && (user === null || user === void 0 ? void 0 : user.role) === 'admin') {
            loadUsers();
        }
    }, [token, user]);
    var handleGrantSubscription = function () { return __awaiter(_this, void 0, void 0, function () {
        var payload, response, error, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!selectedUser)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, 7, 8]);
                    payload = {
                        userId: selectedUser.id,
                        days: grantForm.days,
                        paymentAmount: grantForm.paymentAmount || undefined,
                        paymentNote: grantForm.paymentNote || undefined,
                    };
                    return [4 /*yield*/, fetch('/api/subscription/grant', {
                            method: 'POST',
                            headers: {
                                'Authorization': "Bearer ".concat(token),
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(payload),
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    // Reload users list
                    window.location.reload();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, response.json()];
                case 4:
                    error = _a.sent();
                    alert("Error: ".concat(error.message || 'Failed to grant subscription'));
                    _a.label = 5;
                case 5: return [3 /*break*/, 8];
                case 6:
                    error_2 = _a.sent();
                    console.error('Error granting subscription:', error_2);
                    alert('Error granting subscription');
                    return [3 /*break*/, 8];
                case 7:
                    setShowGrantModal(false);
                    setSelectedUser(null);
                    setGrantForm({ days: 30, paymentAmount: 0, paymentNote: '' });
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    var handleRevokeSubscription = function (userId) { return __awaiter(_this, void 0, void 0, function () {
        var response, error, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!confirm('Are you sure you want to revoke this subscription?'))
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, fetch('/api/subscription/revoke', {
                            method: 'PUT',
                            headers: {
                                'Authorization': "Bearer ".concat(token),
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                userId: userId,
                                reason: 'Revoked by admin'
                            }),
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    // Reload users list
                    window.location.reload();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, response.json()];
                case 4:
                    error = _a.sent();
                    alert("Error: ".concat(error.message || 'Failed to revoke subscription'));
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_3 = _a.sent();
                    console.error('Error revoking subscription:', error_3);
                    alert('Error revoking subscription');
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    if (loading) {
        return (<div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>);
    }
    if (!user || user.role !== 'admin') {
        return (<div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>);
    }
    return (<div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-gray-600">Manage user subscriptions</p>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={function () { return router.push('/dashboard'); }} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                ← Dashboard-ზე დაბრუნება
              </button>
              <div className="text-sm text-gray-500">
                Welcome, {user.name}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Total Users</div>
            <div className="text-2xl font-bold text-gray-900">{users.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Active Subscriptions</div>
            <div className="text-2xl font-bold text-green-600">
              {users.filter(function (u) { var _a; return (_a = u.subscription) === null || _a === void 0 ? void 0 : _a.isActive; }).length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Expired Subscriptions</div>
            <div className="text-2xl font-bold text-red-600">
              {users.filter(function (u) { return u.subscriptionStatus === 'expired'; }).length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">No Subscription</div>
            <div className="text-2xl font-bold text-gray-500">
              {users.filter(function (u) { return !u.subscriptionStatus || u.subscriptionStatus === 'pending'; }).length}
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Users & Subscriptions</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subscription
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Days Remaining
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map(function (user) {
            var _a, _b, _c, _d;
            return (<tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {user.name.substring(0, 2).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={"inline-flex px-2 py-1 text-xs font-semibold rounded-full ".concat(user.status === 'active' ? 'bg-green-100 text-green-800' :
                    user.status === 'blocked' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800')}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={"inline-flex px-2 py-1 text-xs font-semibold rounded-full ".concat(((_a = user.subscription) === null || _a === void 0 ? void 0 : _a.isActive) ? 'bg-green-100 text-green-800' :
                    user.subscriptionStatus === 'expired' ? 'bg-red-100 text-red-800' :
                        user.subscriptionStatus === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                            'bg-yellow-100 text-yellow-800')}>
                        {((_b = user.subscription) === null || _b === void 0 ? void 0 : _b.isActive) ? 'Active' :
                    user.subscriptionStatus || 'None'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {((_c = user.subscription) === null || _c === void 0 ? void 0 : _c.isActive) ? "".concat(user.subscription.daysRemaining, " days") : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.lastPaymentDate ?
                    new Date(user.lastPaymentDate).toLocaleDateString() : '-'}
                      {user.paymentAmount ? (<div className="text-xs text-gray-500">₾{user.paymentAmount}</div>) : null}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button onClick={function () {
                    setSelectedUser(user);
                    setShowGrantModal(true);
                }} className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded">
                        Grant Access
                      </button>
                      {((_d = user.subscription) === null || _d === void 0 ? void 0 : _d.isActive) && (<button onClick={function () { return handleRevokeSubscription(user.id); }} className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded">
                          Revoke
                        </button>)}
                    </td>
                  </tr>);
        })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Grant Subscription Modal */}
      {showGrantModal && selectedUser && (<div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Grant Subscription to {selectedUser.name}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Days</label>
                  <input type="number" value={grantForm.days} onChange={function (e) { return setGrantForm(function (prev) { return (__assign(__assign({}, prev), { days: parseInt(e.target.value) || 0 })); }); }} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" min="1"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Payment Amount (₾)</label>
                  <input type="number" value={grantForm.paymentAmount} onChange={function (e) { return setGrantForm(function (prev) { return (__assign(__assign({}, prev), { paymentAmount: parseFloat(e.target.value) || 0 })); }); }} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" min="0" step="0.01"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Payment Note</label>
                  <textarea value={grantForm.paymentNote} onChange={function (e) { return setGrantForm(function (prev) { return (__assign(__assign({}, prev), { paymentNote: e.target.value })); }); }} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" rows={3} placeholder="Payment details or note..."/>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button onClick={function () {
                setShowGrantModal(false);
                setSelectedUser(null);
                setGrantForm({ days: 30, paymentAmount: 0, paymentNote: '' });
            }} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">
                  Cancel
                </button>
                <button onClick={handleGrantSubscription} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Grant Subscription
                </button>
              </div>
            </div>
          </div>
        </div>)}
    </div>);
}
