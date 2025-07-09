"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Error;
var react_1 = require("react");
var material_1 = require("@mui/material");
function Error(_a) {
    var error = _a.error, reset = _a.reset;
    (0, react_1.useEffect)(function () {
        console.error(error);
    }, [error]);
    return (<material_1.Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '50vh',
            textAlign: 'center',
            gap: 2,
        }}>
      <material_1.Typography variant="h4" color="error">
        რაღაც არასწორად წავიდა!
      </material_1.Typography>
      <material_1.Typography variant="body1" color="text.secondary">
        {error.message || 'მოხდა გაუთვალისწინებელი შეცდომა'}
      </material_1.Typography>
      <material_1.Button variant="contained" onClick={reset} sx={{ mt: 2 }}>
        თავიდან სცადეთ
      </material_1.Button>
    </material_1.Box>);
}
