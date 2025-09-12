'use strict';
'use client';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.Providers = Providers;
var styles_1 = require('@mui/material/styles');
var CssBaseline_1 = __importDefault(require('@mui/material/CssBaseline'));
// Google OAuth provider removed
var AuthProvider_1 = __importDefault(require('../components/AuthProvider'));
var theme = (0, styles_1.createTheme)({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});
// NEXT_PUBLIC_GOOGLE_CLIENT_ID no longer used
function Providers(_a) {
  var children = _a.children;
  return (
    <styles_1.ThemeProvider theme={theme}>
      <CssBaseline_1.default />
      <AuthProvider_1.default>{children}</AuthProvider_1.default>
    </styles_1.ThemeProvider>
  );
}
