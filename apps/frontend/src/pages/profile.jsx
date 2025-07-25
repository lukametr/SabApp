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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ProfilePage;
var react_1 = require("next-auth/react");
var react_2 = require("react");
var material_1 = require("@mui/material");
var router_1 = require("next/router");
function ProfilePage() {
    var _this = this;
    var _a, _b, _c, _d;
    var _e = (0, react_1.useSession)(), session = _e.data, status = _e.status;
    var _f = (0, react_2.useState)(((_a = session === null || session === void 0 ? void 0 : session.user) === null || _a === void 0 ? void 0 : _a.organization) || ''), organization = _f[0], setOrganization = _f[1];
    var _g = (0, react_2.useState)(((_b = session === null || session === void 0 ? void 0 : session.user) === null || _b === void 0 ? void 0 : _b.position) || ''), position = _g[0], setPosition = _g[1];
    var _h = (0, react_2.useState)(false), loading = _h[0], setLoading = _h[1];
    var _j = (0, react_2.useState)(''), success = _j[0], setSuccess = _j[1];
    var _k = (0, react_2.useState)(''), error = _k[0], setError = _k[1];
    var router = (0, router_1.useRouter)();
    if (status === 'loading') {
        return <material_1.Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><material_1.CircularProgress /></material_1.Box>;
    }
    if (!session) {
        router.push('/auth/login');
        return null;
    }
    var handleSave = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var res, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    setLoading(true);
                    setError('');
                    setSuccess('');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, fetch('/api/profile', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ organization: organization, position: position }),
                        })];
                case 2:
                    res = _a.sent();
                    if (!res.ok)
                        throw new Error('პროფილის განახლება ვერ მოხერხდა');
                    setSuccess('პროფილი წარმატებით განახლდა!');
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    setError(err_1.message || 'შეცდომა პროფილის განახლებისას');
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    return (<material_1.Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
      <material_1.Container maxWidth="sm">
        <material_1.Paper elevation={3} sx={{ p: 4 }}>
          <material_1.Typography variant="h5" gutterBottom>პროფილი</material_1.Typography>
          <material_1.Typography variant="body1" sx={{ mb: 2 }}>ელ. ფოსტა: {(_c = session.user) === null || _c === void 0 ? void 0 : _c.email}</material_1.Typography>
          <material_1.Typography variant="body1" sx={{ mb: 2 }}>სახელი: {(_d = session.user) === null || _d === void 0 ? void 0 : _d.name}</material_1.Typography>
          {error && <material_1.Alert severity="error" sx={{ mb: 2 }}>{error}</material_1.Alert>}
          {success && <material_1.Alert severity="success" sx={{ mb: 2 }}>{success}</material_1.Alert>}
          <material_1.Box component="form" onSubmit={handleSave} sx={{ mb: 2 }}>
            <material_1.TextField fullWidth label="ორგანიზაცია" value={organization} onChange={function (e) { return setOrganization(e.target.value); }} sx={{ mb: 2 }}/>
            <material_1.TextField fullWidth label="პოზიცია" value={position} onChange={function (e) { return setPosition(e.target.value); }} sx={{ mb: 2 }}/>
            <material_1.Button type="submit" variant="contained" fullWidth disabled={loading}>{loading ? <material_1.CircularProgress size={24}/> : 'შენახვა'}</material_1.Button>
          </material_1.Box>
          <material_1.Button variant="outlined" color="error" fullWidth onClick={function () { return (0, react_1.signOut)({ callbackUrl: '/auth/login' }); }}>გასვლა</material_1.Button>
        </material_1.Paper>
      </material_1.Container>
    </material_1.Box>);
}
