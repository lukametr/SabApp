"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Loading;
var material_1 = require("@mui/material");
function Loading() {
    return (<material_1.Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '50vh',
            gap: 2,
        }}>
      <material_1.CircularProgress size={60}/>
      <material_1.Typography variant="h6" color="text.secondary">
        იტვირთება...
      </material_1.Typography>
    </material_1.Box>);
}
