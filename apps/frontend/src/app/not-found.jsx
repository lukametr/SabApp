"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NotFound;
var material_1 = require("@mui/material");
var link_1 = __importDefault(require("next/link"));
function NotFound() {
    return (<material_1.Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '50vh',
            textAlign: 'center',
            gap: 2,
        }}>
      <material_1.Typography variant="h1" color="primary">
        404
      </material_1.Typography>
      <material_1.Typography variant="h4" color="text.primary">
        გვერდი ვერ მოიძებნა
      </material_1.Typography>
      <material_1.Typography variant="body1" color="text.secondary">
        თქვენ მიერ მოძებნული გვერდი არ არსებობს.
      </material_1.Typography>
      <link_1.default href="/" passHref>
        <material_1.Button variant="contained" sx={{ mt: 2 }}>
          მთავარ გვერდზე დაბრუნება
        </material_1.Button>
      </link_1.default>
    </material_1.Box>);
}
