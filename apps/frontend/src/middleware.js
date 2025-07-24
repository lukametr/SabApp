"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.middleware = middleware;
var server_1 = require("next/server");
function middleware(request) {
    var cspHeader = "\n    default-src 'self';\n    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.googleapis.com https://*.gstatic.com *.google.com https://*.ggpht.com *.googleusercontent.com https://accounts.google.com blob:;\n    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;\n    img-src 'self' data: blob: https://*.googleapis.com https://*.gstatic.com *.google.com *.googleusercontent.com;\n    font-src 'self' https://fonts.gstatic.com;\n    object-src 'none';\n    base-uri 'self';\n    form-action 'self';\n    frame-ancestors 'none';\n    connect-src 'self' https://*.googleapis.com *.google.com https://*.gstatic.com data: blob: https://sabapp.com;\n    frame-src *.google.com;\n    worker-src blob:;\n  ";
    // Replace newline characters and spaces
    var contentSecurityPolicyHeaderValue = cspHeader
        .replace(/\s{2,}/g, ' ')
        .trim();
    var requestHeaders = new Headers(request.headers);
    requestHeaders.set('Content-Security-Policy', contentSecurityPolicyHeaderValue);
    var response = server_1.NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
    response.headers.set('Content-Security-Policy', contentSecurityPolicyHeaderValue);
    return response;
}
exports.config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        {
            source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
            missing: [
                { type: 'header', key: 'next-router-prefetch' },
                { type: 'header', key: 'purpose', value: 'prefetch' },
            ],
        },
    ],
};
