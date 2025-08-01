"use strict";
'use client';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ExcelPage;
var material_1 = require("@mui/material");
var ExcelAnalyzer_1 = __importDefault(require("../../../components/ExcelAnalyzer"));
function ExcelPage() {
    return (<material_1.Container maxWidth="xl">
      <material_1.Box sx={{ py: 4 }}>
        <ExcelAnalyzer_1.default />
      </material_1.Box>
    </material_1.Container>);
}
