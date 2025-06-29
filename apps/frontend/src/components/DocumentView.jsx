"use strict";
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
exports.DocumentView = void 0;
var react_1 = __importDefault(require("react"));
var material_1 = require("@mui/material");
var icons_material_1 = require("@mui/icons-material");
var documentStore_1 = require("../store/documentStore");
var date_fns_1 = require("date-fns");
var locale_1 = require("date-fns/locale");
var DocumentView = function (_a) {
    var _b, _c;
    var document = _a.document, onEdit = _a.onEdit, onDelete = _a.onDelete;
    var _d = (0, documentStore_1.useDocumentStore)(), toggleFavorite = _d.toggleFavorite, downloadDocument = _d.downloadDocument;
    var handleFavoriteClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, toggleFavorite(document.id)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var handleDownload = function () { return __awaiter(void 0, void 0, void 0, function () {
        var blob, url, a, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, downloadDocument(document.id)];
                case 1:
                    blob = _a.sent();
                    url = window.URL.createObjectURL(blob);
                    a = window.document.createElement('a');
                    a.href = url;
                    a.download = document.filePath || 'document';
                    window.document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    window.document.body.removeChild(a);
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error('Error downloading document:', error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var getRiskColor = function (risk) {
        if (risk <= 3)
            return 'success';
        if (risk <= 7)
            return 'warning';
        return 'error';
    };
    return (<material_1.Card>
      <material_1.CardContent>
        <material_1.Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <material_1.Typography variant="h5" component="h2">
            {document.objectName}
          </material_1.Typography>
          <material_1.Box>
            <material_1.Tooltip title={document.isFavorite ? 'ფავორიტებიდან ამოშლა' : 'ფავორიტებში დამატება'}>
              <material_1.IconButton onClick={handleFavoriteClick}>
                {document.isFavorite ? <icons_material_1.Favorite color="error"/> : <icons_material_1.FavoriteBorder />}
              </material_1.IconButton>
            </material_1.Tooltip>
            <material_1.Tooltip title="ჩამოტვირთვა">
              <material_1.IconButton onClick={handleDownload}>
                <icons_material_1.Download />
              </material_1.IconButton>
            </material_1.Tooltip>
            {onEdit && (<material_1.Tooltip title="რედაქტირება">
                <material_1.IconButton onClick={onEdit}>
                  <icons_material_1.Edit />
                </material_1.IconButton>
              </material_1.Tooltip>)}
            {onDelete && (<material_1.Tooltip title="წაშლა">
                <material_1.IconButton onClick={onDelete}>
                  <icons_material_1.Delete />
                </material_1.IconButton>
              </material_1.Tooltip>)}
          </material_1.Box>
        </material_1.Box>

        <material_1.Grid container spacing={2}>
          <material_1.Grid item xs={12} md={6}>
            <material_1.Typography variant="subtitle2" color="textSecondary">
              შემფასებელი
            </material_1.Typography>
            <material_1.Typography variant="body1">
              {document.evaluatorName} {document.evaluatorLastName}
            </material_1.Typography>
          </material_1.Grid>

          <material_1.Grid item xs={12} md={6}>
            <material_1.Typography variant="subtitle2" color="textSecondary">
              თარიღი და დრო
            </material_1.Typography>
            <material_1.Typography variant="body1">
              {(0, date_fns_1.format)(new Date(document.date), 'dd MMMM yyyy', { locale: locale_1.ka })} {(0, date_fns_1.format)(new Date(document.time), 'HH:mm')}
            </material_1.Typography>
          </material_1.Grid>

          <material_1.Grid item xs={12}>
            <material_1.Typography variant="subtitle2" color="textSecondary">
              სამუშაოს აღწერა
            </material_1.Typography>
            <material_1.Typography variant="body1">{document.workDescription}</material_1.Typography>
          </material_1.Grid>

          <material_1.Grid item xs={12}>
            <material_1.Typography variant="h6" gutterBottom>
              საფრთხეთა იდენტიფიკაცია ({((_b = document.hazards) === null || _b === void 0 ? void 0 : _b.length) || 0} საფრთხე)
            </material_1.Typography>
            
            {(_c = document.hazards) === null || _c === void 0 ? void 0 : _c.map(function (hazard, index) { return (<material_1.Accordion key={hazard.id || index} sx={{ mb: 2 }}>
                <material_1.AccordionSummary expandIcon={<icons_material_1.ExpandMore />}>
                  <material_1.Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                    <material_1.Typography>
                      საფრთხე #{index + 1}: {hazard.hazardIdentification}
                    </material_1.Typography>
                    <material_1.Chip label={"\u10E0\u10D8\u10E1\u10D9\u10D8: ".concat(hazard.residualRisk.total)} color={getRiskColor(hazard.residualRisk.total)} size="small"/>
                  </material_1.Box>
                </material_1.AccordionSummary>
                <material_1.AccordionDetails>
                  <material_1.Grid container spacing={2}>
                    <material_1.Grid item xs={12}>
                      <material_1.Typography variant="subtitle2" color="textSecondary">
                        დაზარალებული პირები
                      </material_1.Typography>
                      <material_1.Typography variant="body1">{hazard.affectedPersons.join(', ')}</material_1.Typography>
                    </material_1.Grid>

                    <material_1.Grid item xs={12}>
                      <material_1.Typography variant="subtitle2" color="textSecondary">
                        დაზიანების აღწერა
                      </material_1.Typography>
                      <material_1.Typography variant="body1">{hazard.injuryDescription}</material_1.Typography>
                    </material_1.Grid>

                    <material_1.Grid item xs={12}>
                      <material_1.Typography variant="subtitle2" color="textSecondary">
                        არსებული კონტროლის ზომები
                      </material_1.Typography>
                      <material_1.Typography variant="body1">{hazard.existingControlMeasures}</material_1.Typography>
                    </material_1.Grid>

                    <material_1.Grid item xs={12}>
                      <material_1.Typography variant="h6">საწყისი რისკი</material_1.Typography>
                      <material_1.Grid container spacing={2}>
                        <material_1.Grid item xs={4}>
                          <material_1.Typography variant="subtitle2" color="textSecondary">
                            ალბათობა
                          </material_1.Typography>
                          <material_1.Typography variant="body1">{hazard.initialRisk.probability}</material_1.Typography>
                        </material_1.Grid>
                        <material_1.Grid item xs={4}>
                          <material_1.Typography variant="subtitle2" color="textSecondary">
                            სიმძიმე
                          </material_1.Typography>
                          <material_1.Typography variant="body1">{hazard.initialRisk.severity}</material_1.Typography>
                        </material_1.Grid>
                        <material_1.Grid item xs={4}>
                          <material_1.Typography variant="subtitle2" color="textSecondary">
                            ჯამი
                          </material_1.Typography>
                          <material_1.Typography variant="body1">{hazard.initialRisk.total}</material_1.Typography>
                        </material_1.Grid>
                      </material_1.Grid>
                    </material_1.Grid>

                    <material_1.Grid item xs={12}>
                      <material_1.Typography variant="subtitle2" color="textSecondary">
                        დამატებითი კონტროლის ზომები
                      </material_1.Typography>
                      <material_1.Typography variant="body1">{hazard.additionalControlMeasures}</material_1.Typography>
                    </material_1.Grid>

                    <material_1.Grid item xs={12}>
                      <material_1.Typography variant="h6">დარჩენილი რისკი</material_1.Typography>
                      <material_1.Grid container spacing={2}>
                        <material_1.Grid item xs={4}>
                          <material_1.Typography variant="subtitle2" color="textSecondary">
                            ალბათობა
                          </material_1.Typography>
                          <material_1.Typography variant="body1">{hazard.residualRisk.probability}</material_1.Typography>
                        </material_1.Grid>
                        <material_1.Grid item xs={4}>
                          <material_1.Typography variant="subtitle2" color="textSecondary">
                            სიმძიმე
                          </material_1.Typography>
                          <material_1.Typography variant="body1">{hazard.residualRisk.severity}</material_1.Typography>
                        </material_1.Grid>
                        <material_1.Grid item xs={4}>
                          <material_1.Typography variant="subtitle2" color="textSecondary">
                            ჯამი
                          </material_1.Typography>
                          <material_1.Typography variant="body1">{hazard.residualRisk.total}</material_1.Typography>
                        </material_1.Grid>
                      </material_1.Grid>
                    </material_1.Grid>

                    <material_1.Grid item xs={12}>
                      <material_1.Typography variant="subtitle2" color="textSecondary">
                        საჭირო ზომები
                      </material_1.Typography>
                      <material_1.Typography variant="body1">{hazard.requiredMeasures}</material_1.Typography>
                    </material_1.Grid>

                    <material_1.Grid item xs={12} md={6}>
                      <material_1.Typography variant="subtitle2" color="textSecondary">
                        პასუხისმგებელი პირი
                      </material_1.Typography>
                      <material_1.Typography variant="body1">{hazard.responsiblePerson}</material_1.Typography>
                    </material_1.Grid>

                    <material_1.Grid item xs={12} md={6}>
                      <material_1.Typography variant="subtitle2" color="textSecondary">
                        განხილვის თარიღი
                      </material_1.Typography>
                      <material_1.Typography variant="body1">
                        {(0, date_fns_1.format)(new Date(hazard.reviewDate), 'dd MMMM yyyy', { locale: locale_1.ka })}
                      </material_1.Typography>
                    </material_1.Grid>
                  </material_1.Grid>
                </material_1.AccordionDetails>
              </material_1.Accordion>); })}
          </material_1.Grid>
        </material_1.Grid>
      </material_1.CardContent>
    </material_1.Card>);
};
exports.DocumentView = DocumentView;
