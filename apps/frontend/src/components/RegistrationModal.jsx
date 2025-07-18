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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RegistrationModal;
var react_1 = __importDefault(require("react"));
var material_1 = require("@mui/material");
var react_hook_form_1 = require("react-hook-form");
function RegistrationModal(_a) {
    var _this = this;
    var open = _a.open, onClose = _a.onClose, onSubmit = _a.onSubmit, userInfo = _a.userInfo, _b = _a.loading, loading = _b === void 0 ? false : _b, error = _a.error;
    var _c = (0, react_hook_form_1.useForm)(), register = _c.register, handleSubmit = _c.handleSubmit, errors = _c.formState.errors, reset = _c.reset;
    var handleFormSubmit = function (data) { return __awaiter(_this, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, onSubmit(data)];
                case 1:
                    _a.sent();
                    reset();
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleClose = function () {
        reset();
        onClose();
    };
    return (<material_1.Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <material_1.DialogTitle>
        <material_1.Typography variant="h5" component="h2">
          რეგისტრაციის დასრულება
        </material_1.Typography>
        {userInfo && (<material_1.Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            გამარჯობა, {userInfo.name}! რეგისტრაციის დასასრულებლად გთხოვთ შეიყვანოთ დამატებითი ინფორმაცია.
          </material_1.Typography>)}
      </material_1.DialogTitle>
      
      <material_1.DialogContent>
        <material_1.Box component="form" onSubmit={handleSubmit(handleFormSubmit)} sx={{ mt: 2 }}>
          {error && (<material_1.Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </material_1.Alert>)}
          
          // Removed personalNumber TextField
          
          // Removed phoneNumber TextField
          
          <material_1.Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <material_1.Button onClick={handleClose} disabled={loading}>
              გაუქმება
            </material_1.Button>
            <material_1.Button type="submit" variant="contained" disabled={loading} sx={{ minWidth: 120 }}>
              {loading ? 'რეგისტრაცია...' : 'რეგისტრაცია'}
            </material_1.Button>
          </material_1.Box>
        </material_1.Box>
      </material_1.DialogContent>
    </material_1.Dialog>);
}
