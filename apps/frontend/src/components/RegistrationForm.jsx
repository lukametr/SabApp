"use strict";
'use client';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RegistrationForm;
var react_1 = __importDefault(require("react"));
var material_1 = require("@mui/material");
function RegistrationForm(_a) {
    // Removed personalNumber, phoneNumber, and errors state
    var open = _a.open, onClose = _a.onClose, onSubmit = _a.onSubmit, _b = _a.loading, loading = _b === void 0 ? false : _b;
    // Removed validateForm
    var handleSubmit = function (e) {
        e.preventDefault();
        onSubmit();
    };
    var handleClose = function () {
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
            {/* Removed personalNumber and phoneNumber fields */}
          </material_1.Box>
        </material_1.DialogContent>
        
        <material_1.DialogActions sx={{ p: 2, pt: 0 }}>
          <material_1.Button onClick={handleClose} disabled={loading}>
            გაუქმება
          </material_1.Button>
          <material_1.Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'რეგისტრაცია...' : 'რეგისტრაცია'}
          </material_1.Button>
        </material_1.DialogActions>
      </form>
    </material_1.Dialog>);
}
