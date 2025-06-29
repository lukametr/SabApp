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
var inter = (0, google_1.Inter)({ subsets: ['latin'] });
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
    return (<html lang="en">
      <body className={inter.className}>
        <providers_1.Providers>
          <Navigation_1.default />
          {children}
        </providers_1.Providers>
      </body>
    </html>);
}
