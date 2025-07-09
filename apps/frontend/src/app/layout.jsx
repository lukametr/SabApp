"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = exports.viewport = void 0;
exports.default = RootLayout;
var google_1 = require("next/font/google");
require("./globals.css");
var providers_1 = require("./providers");
var Navigation_1 = __importDefault(require("../components/Navigation"));
var script_1 = __importDefault(require("next/script"));
// Font optimization with proper configuration
var inter = (0, google_1.Inter)({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
    fallback: ['system-ui', 'arial'],
});
exports.viewport = {
    width: 'device-width',
    initialScale: 1,
};
exports.metadata = {
    title: 'Document Management System',
    description: 'A modern document management system',
    icons: {
        icon: '/favicon.ico',
    },
};
function RootLayout(_a) {
    var children = _a.children;
    return (<html lang="ka" className={inter.variable}>
      <head>
        {/* Font preconnect for better performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        
        {/* Google Sign-In Script */}
        <script_1.default src="https://accounts.google.com/gsi/client?hl=ka" async defer strategy="beforeInteractive"/>
      </head>
      <body className={"".concat(inter.className, " font-sans")}>
        <providers_1.Providers>
          <Navigation_1.default />
          {children}
        </providers_1.Providers>
      </body>
    </html>);
}
