"use strict";
'use client';
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ExcelAnalyzer;
var react_1 = __importStar(require("react"));
var material_1 = require("@mui/material");
var icons_material_1 = require("@mui/icons-material");
var react_dropzone_1 = require("react-dropzone");
var api_1 = __importDefault(require("../lib/api"));
function ExcelAnalyzer() {
    var _this = this;
    var _a = (0, react_1.useState)(null), analysisResult = _a[0], setAnalysisResult = _a[1];
    var _b = (0, react_1.useState)(false), loading = _b[0], setLoading = _b[1];
    var _c = (0, react_1.useState)(null), error = _c[0], setError = _c[1];
    var _d = (0, react_1.useState)(''), selectedSheet = _d[0], setSelectedSheet = _d[1];
    var _e = (0, react_1.useState)({
        startRow: 2,
        endRow: '',
        columns: ''
    }), extractOptions = _e[0], setExtractOptions = _e[1];
    var _f = (0, react_1.useState)(null), extractedData = _f[0], setExtractedData = _f[1];
    var onDrop = (0, react_1.useCallback)(function (acceptedFiles) { return __awaiter(_this, void 0, void 0, function () {
        var file, formData, response, err_1;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    file = acceptedFiles[0];
                    if (!file)
                        return [2 /*return*/];
                    setLoading(true);
                    setError(null);
                    setAnalysisResult(null);
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, 4, 5]);
                    formData = new FormData();
                    formData.append('file', file);
                    console.log('📊 Excel ფაილის ატვირთვა:', file.name);
                    return [4 /*yield*/, api_1.default.post('/excel/analyze', formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        })];
                case 2:
                    response = _d.sent();
                    if (response.data.success) {
                        setAnalysisResult(response.data.data);
                        setSelectedSheet(((_a = response.data.data.sheets[0]) === null || _a === void 0 ? void 0 : _a.name) || '');
                        console.log('✅ Excel ანალიზი დასრულდა:', response.data.data);
                    }
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _d.sent();
                    console.error('❌ Excel ანალიზის შეცდომა:', err_1);
                    setError(((_c = (_b = err_1.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || 'Excel ფაილის ანალიზი ვერ მოხერხდა');
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, []);
    var _g = (0, react_dropzone_1.useDropzone)({
        onDrop: onDrop,
        accept: {
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls']
        },
        maxFiles: 1,
        maxSize: 10 * 1024 * 1024 // 10MB
    }), getRootProps = _g.getRootProps, getInputProps = _g.getInputProps, isDragActive = _g.isDragActive;
    var handleExtractData = function () { return __awaiter(_this, void 0, void 0, function () {
        var formData;
        var _a, _b;
        return __generator(this, function (_c) {
            if (!analysisResult)
                return [2 /*return*/];
            setLoading(true);
            setError(null);
            try {
                formData = new FormData();
                // Re-create file for extraction (this is a limitation, in real app you'd store the file)
                // For now, we'll skip this feature and focus on the analysis
                console.log('📊 მონაცემების ექსტრაქტი:', {
                    sheet: selectedSheet,
                    options: extractOptions
                });
                // This would be the extraction call
                // const response = await api.post('/excel/extract', formData);
                alert('მონაცემების ექსტრაქტისთვის გთხოვთ ხელახლა ატვირთოთ ფაილი');
            }
            catch (err) {
                console.error('❌ ექსტრაქტის შეცდომა:', err);
                setError(((_b = (_a = err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'მონაცემების ექსტრაქტი ვერ მოხერხდა');
            }
            finally {
                setLoading(false);
            }
            return [2 /*return*/];
        });
    }); };
    var renderDataTypeChip = function (type, count) {
        var colors = {
            string: 'primary',
            number: 'success',
            date: 'warning',
            boolean: 'info',
            formula: 'secondary'
        };
        return (<material_1.Chip key={type} label={"".concat(type, ": ").concat(count)} color={colors[type] || 'default'} size="small" sx={{ m: 0.5 }}/>);
    };
    var renderSheetPreview = function (sheet) {
        var previewData = sheet.data.slice(0, 5); // First 5 rows
        var previewHeaders = sheet.headers.slice(0, 10); // First 10 columns
        return (<material_1.TableContainer component={material_1.Paper} sx={{ maxHeight: 400 }}>
        <material_1.Table stickyHeader size="small">
          <material_1.TableHead>
            <material_1.TableRow>
              {previewHeaders.map(function (header, index) { return (<material_1.TableCell key={index} sx={{ fontWeight: 'bold' }}>
                  {header || "Column ".concat(index + 1)}
                </material_1.TableCell>); })}
            </material_1.TableRow>
          </material_1.TableHead>
          <material_1.TableBody>
            {previewData.map(function (row, rowIndex) { return (<material_1.TableRow key={rowIndex}>
                {previewHeaders.map(function (_, colIndex) { return (<material_1.TableCell key={colIndex}>
                    {row[colIndex] !== null && row[colIndex] !== undefined
                        ? String(row[colIndex]).slice(0, 50)
                        : ''}
                  </material_1.TableCell>); })}
              </material_1.TableRow>); })}
          </material_1.TableBody>
        </material_1.Table>
      </material_1.TableContainer>);
    };
    return (<material_1.Box sx={{ p: 3 }}>
      <material_1.Typography variant="h4" gutterBottom>
        📊 Excel ანალიზატორი
      </material_1.Typography>
      <material_1.Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        ატვირთეთ Excel ფაილი მისი შიგთავსის ანალიზისთვის
      </material_1.Typography>

      {/* File Upload Area */}
      <material_1.Paper {...getRootProps()} sx={{
            p: 4,
            textAlign: 'center',
            border: '2px dashed',
            borderColor: isDragActive ? 'primary.main' : 'grey.300',
            bgcolor: isDragActive ? 'primary.50' : 'background.paper',
            cursor: 'pointer',
            mb: 3,
            transition: 'all 0.2s ease'
        }}>
        <input {...getInputProps()}/>
        <icons_material_1.CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }}/>
        <material_1.Typography variant="h6" gutterBottom>
          {isDragActive ? 'ფაილის ჩაგდება...' : 'Excel ფაილის ატვირთვა'}
        </material_1.Typography>
        <material_1.Typography variant="body2" color="text.secondary">
          მხარდაჭერილი ფორმატები: .xlsx, .xls (მაქს. 10MB)
        </material_1.Typography>
        <material_1.Button variant="outlined" sx={{ mt: 2 }}>
          ფაილის არჩევა
        </material_1.Button>
      </material_1.Paper>

      {/* Loading */}
      {loading && (<material_1.Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <material_1.CircularProgress />
          <material_1.Typography sx={{ ml: 2 }}>Excel ფაილის ანალიზი...</material_1.Typography>
        </material_1.Box>)}

      {/* Error */}
      {error && (<material_1.Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </material_1.Alert>)}

      {/* Analysis Results */}
      {analysisResult && (<material_1.Box>
          <material_1.Typography variant="h5" gutterBottom>
            📋 ანალიზის შედეგები
          </material_1.Typography>

          {/* File Info */}
          <material_1.Card sx={{ mb: 3 }}>
            <material_1.CardContent>
              <material_1.Grid container spacing={2}>
                <material_1.Grid item xs={12} md={6}>
                  <material_1.Typography variant="h6">📄 ფაილის ინფორმაცია</material_1.Typography>
                  <material_1.Typography>ფაილის სახელი: {analysisResult.fileName}</material_1.Typography>
                  <material_1.Typography>Sheet-ების რაოდენობა: {analysisResult.sheetCount}</material_1.Typography>
                  {analysisResult.metadata.creator && (<material_1.Typography>შემქმნელი: {analysisResult.metadata.creator}</material_1.Typography>)}
                </material_1.Grid>
                <material_1.Grid item xs={12} md={6}>
                  <material_1.Typography variant="h6">📊 სტატისტიკა</material_1.Typography>
                  <material_1.Typography>
                    სულ სტრიქონები: {analysisResult.sheets.reduce(function (sum, sheet) { return sum + sheet.rowCount; }, 0)}
                  </material_1.Typography>
                  <material_1.Typography>
                    სულ უჯრები: {analysisResult.sheets.reduce(function (sum, sheet) { return sum + sheet.summary.totalCells; }, 0)}
                  </material_1.Typography>
                  <material_1.Typography>
                    შევსებული უჯრები: {analysisResult.sheets.reduce(function (sum, sheet) { return sum + sheet.summary.filledCells; }, 0)}
                  </material_1.Typography>
                </material_1.Grid>
              </material_1.Grid>
            </material_1.CardContent>
          </material_1.Card>

          {/* Sheets Analysis */}
          {analysisResult.sheets.map(function (sheet, index) { return (<material_1.Accordion key={index} defaultExpanded={index === 0}>
              <material_1.AccordionSummary expandIcon={<icons_material_1.ExpandMore />}>
                <material_1.Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <icons_material_1.TableChart />
                  <material_1.Typography variant="h6">{sheet.name}</material_1.Typography>
                  <material_1.Chip label={"".concat(sheet.rowCount, " \u10E1\u10E2\u10E0\u10D8\u10E5\u10DD\u10DC\u10D8")} size="small"/>
                  <material_1.Chip label={"".concat(sheet.columnCount, " \u10E1\u10D5\u10D4\u10E2\u10D8")} size="small"/>
                </material_1.Box>
              </material_1.AccordionSummary>
              <material_1.AccordionDetails>
                <material_1.Grid container spacing={3}>
                  {/* Sheet Statistics */}
                  <material_1.Grid item xs={12} md={4}>
                    <material_1.Typography variant="h6" gutterBottom>📈 სტატისტიკა</material_1.Typography>
                    <material_1.Typography>სულ უჯრები: {sheet.summary.totalCells}</material_1.Typography>
                    <material_1.Typography>შევსებული: {sheet.summary.filledCells}</material_1.Typography>
                    <material_1.Typography>ცარიელი: {sheet.summary.emptyCells}</material_1.Typography>
                    
                    <material_1.Box sx={{ mt: 2 }}>
                      <material_1.Typography variant="subtitle2" gutterBottom>მონაცემების ტიპები:</material_1.Typography>
                      {Object.entries(sheet.summary.dataTypes).map(function (_a) {
                    var type = _a[0], count = _a[1];
                    return count > 0 && renderDataTypeChip(type, count);
                })}
                    </material_1.Box>
                  </material_1.Grid>

                  {/* Headers */}
                  <material_1.Grid item xs={12} md={8}>
                    <material_1.Typography variant="h6" gutterBottom>📋 სვეტების სათაურები</material_1.Typography>
                    <material_1.Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {sheet.headers.slice(0, 20).map(function (header, i) { return (<material_1.Chip key={i} label={header || "Column ".concat(i + 1)} variant="outlined" size="small"/>); })}
                      {sheet.headers.length > 20 && (<material_1.Typography variant="caption">
                          ... და კიდევ {sheet.headers.length - 20} სვეტი
                        </material_1.Typography>)}
                    </material_1.Box>
                  </material_1.Grid>

                  {/* Data Preview */}
                  <material_1.Grid item xs={12}>
                    <material_1.Typography variant="h6" gutterBottom>
                      <icons_material_1.Visibility sx={{ mr: 1 }}/>
                      მონაცემების ნიმუში (პირველი 5 სტრიქონი)
                    </material_1.Typography>
                    {renderSheetPreview(sheet)}
                  </material_1.Grid>
                </material_1.Grid>
              </material_1.AccordionDetails>
            </material_1.Accordion>); })}

          {/* Data Extraction Options */}
          <material_1.Card sx={{ mt: 3 }}>
            <material_1.CardContent>
              <material_1.Typography variant="h6" gutterBottom>
                <icons_material_1.GetApp sx={{ mr: 1 }}/>
                მონაცემების ექსტრაქტი
              </material_1.Typography>
              <material_1.Grid container spacing={2} sx={{ mb: 2 }}>
                <material_1.Grid item xs={12} md={3}>
                  <material_1.FormControl fullWidth>
                    <material_1.InputLabel>Sheet</material_1.InputLabel>
                    <material_1.Select value={selectedSheet} onChange={function (e) { return setSelectedSheet(e.target.value); }}>
                      {analysisResult.sheets.map(function (sheet) { return (<material_1.MenuItem key={sheet.name} value={sheet.name}>
                          {sheet.name}
                        </material_1.MenuItem>); })}
                    </material_1.Select>
                  </material_1.FormControl>
                </material_1.Grid>
                <material_1.Grid item xs={12} md={3}>
                  <material_1.TextField label="საწყისი სტრიქონი" type="number" value={extractOptions.startRow} onChange={function (e) { return setExtractOptions(__assign(__assign({}, extractOptions), { startRow: parseInt(e.target.value) })); }} fullWidth/>
                </material_1.Grid>
                <material_1.Grid item xs={12} md={3}>
                  <material_1.TextField label="ბოლო სტრიქონი" type="number" value={extractOptions.endRow} onChange={function (e) { return setExtractOptions(__assign(__assign({}, extractOptions), { endRow: e.target.value })); }} fullWidth placeholder="ავტომატური"/>
                </material_1.Grid>
                <material_1.Grid item xs={12} md={3}>
                  <material_1.Button variant="contained" onClick={handleExtractData} disabled={loading} fullWidth sx={{ height: '56px' }}>
                    ექსტრაქტი
                  </material_1.Button>
                </material_1.Grid>
              </material_1.Grid>
            </material_1.CardContent>
          </material_1.Card>
        </material_1.Box>)}
    </material_1.Box>);
}
