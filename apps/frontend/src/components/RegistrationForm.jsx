"use strict";
'use client';
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RegistrationForm;
var react_1 = __importStar(require("react"));
var material_1 = require("@mui/material");
function RegistrationForm(_a) {
    var open = _a.open, onClose = _a.onClose, onSubmit = _a.onSubmit, _b = _a.loading, loading = _b === void 0 ? false : _b;
    var _c = (0, react_1.useState)(''), personalNumber = _c[0], setPersonalNumber = _c[1];
    var _d = (0, react_1.useState)(''), phoneNumber = _d[0], setPhoneNumber = _d[1];
    var _e = (0, react_1.useState)({}), errors = _e[0], setErrors = _e[1];
    var validateForm = function () {
        var newErrors = {};
        if (!personalNumber.trim()) {
            newErrors.personalNumber = 'პირადი ნომერი სავალდებულოა';
        }
        else if (personalNumber.length !== 11) {
            newErrors.personalNumber = 'პირადი ნომერი უნდა შეიცავდეს 11 ციფრს';
        }
        if (!phoneNumber.trim()) {
            newErrors.phoneNumber = 'ტელეფონის ნომერი სავალდებულოა';
        }
        else if (!/^5\d{8}$/.test(phoneNumber)) {
            newErrors.phoneNumber = 'ტელეფონის ნომერი უნდა იწყებოდეს 5-ით და შეიცავდეს 9 ციფრს';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    var handleSubmit = function (e) {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(personalNumber.trim(), phoneNumber.trim());
        }
    };
    var handleClose = function () {
        setPersonalNumber('');
        setPhoneNumber('');
        setErrors({});
        onClose();
    };
    return (<material_1.Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <material_1.DialogTitle>
        <material_1.Typography variant="h6" component="div">
          რეგისტრაციის დასრულება
        </material_1.Typography>
      </material_1.DialogTitle>
      <form onSubmit={handleSubmit}>
        <material_1.DialogContent>
          <material_1.Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            გთხოვთ შეიყვანოთ დამატებითი ინფორმაცია თქვენი ანგარიშის დასასრულებლად
          </material_1.Typography>
          
          <material_1.Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <material_1.TextField label="პირადი ნომერი" value={personalNumber} onChange={function (e) { return setPersonalNumber(e.target.value); }} error={!!errors.personalNumber} helperText={errors.personalNumber} placeholder="00000000000" inputProps={{ maxLength: 11 }} fullWidth required/>
            
            <material_1.TextField label="ტელეფონის ნომერი" value={phoneNumber} onChange={function (e) { return setPhoneNumber(e.target.value); }} error={!!errors.phoneNumber} helperText={errors.phoneNumber} placeholder="500000000" inputProps={{ maxLength: 9 }} fullWidth required/>
          </material_1.Box>
        </material_1.DialogContent>
        
        <material_1.DialogActions sx={{ p: 2, pt: 0 }}>
          <material_1.Button onClick={handleClose} disabled={loading}>
            გაუქმება
          </material_1.Button>
          <material_1.Button type="submit" variant="contained" disabled={loading || !personalNumber.trim() || !phoneNumber.trim()}>
            {loading ? 'რეგისტრაცია...' : 'რეგისტრაცია'}
          </material_1.Button>
        </material_1.DialogActions>
      </form>
    </material_1.Dialog>);
}
