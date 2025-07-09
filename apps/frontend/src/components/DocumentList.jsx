"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var material_1 = require("@mui/material");
var icons_material_1 = require("@mui/icons-material");
var DocumentList = react_1.default.memo(function (_a) {
    var documents = _a.documents, onEdit = _a.onEdit, onDelete = _a.onDelete, onSelect = _a.onSelect;
    var handleEdit = (0, react_1.useCallback)(function (e, doc) {
        e.stopPropagation();
        onEdit === null || onEdit === void 0 ? void 0 : onEdit(doc);
    }, [onEdit]);
    var handleDelete = (0, react_1.useCallback)(function (e, doc) {
        e.stopPropagation();
        onDelete === null || onDelete === void 0 ? void 0 : onDelete(doc);
    }, [onDelete]);
    var handleSelect = (0, react_1.useCallback)(function (doc) {
        onSelect === null || onSelect === void 0 ? void 0 : onSelect(doc);
    }, [onSelect]);
    var getRiskColor = (0, react_1.useCallback)(function (risk) {
        if (risk <= 3)
            return 'success';
        if (risk <= 7)
            return 'warning';
        return 'error';
    }, []);
    var formatDate = (0, react_1.useCallback)(function (date) {
        return new Date(date).toLocaleDateString('ka-GE');
    }, []);
    var getMaxRisk = (0, react_1.useCallback)(function (hazards) {
        if (!hazards || hazards.length === 0)
            return 0;
        return Math.max.apply(Math, hazards.map(function (h) { var _a; return ((_a = h.residualRisk) === null || _a === void 0 ? void 0 : _a.total) || 0; }));
    }, []);
    return (<material_1.TableContainer component={material_1.Paper}>
      <material_1.Table>
        <material_1.TableHead>
          <material_1.TableRow>
            <material_1.TableCell>ობიექტის სახელი</material_1.TableCell>
            <material_1.TableCell>შემფასებელი</material_1.TableCell>
            <material_1.TableCell>თარიღი</material_1.TableCell>
            <material_1.TableCell>საფრთხეების რაოდენობა</material_1.TableCell>
            <material_1.TableCell>მაქსიმალური რისკი</material_1.TableCell>
            <material_1.TableCell>მოქმედებები</material_1.TableCell>
          </material_1.TableRow>
        </material_1.TableHead>
        <material_1.TableBody>
          {documents.map(function (doc) {
            var _a;
            return (<material_1.TableRow key={doc.id} onClick={function () { return handleSelect(doc); }} sx={{
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: 'action.hover' }
                }}>
              <material_1.TableCell>
                <material_1.Box>
                  <material_1.Typography variant="body1">{doc.objectName}</material_1.Typography>
                  <material_1.Typography variant="caption" color="textSecondary">
                    {doc.workDescription}
                  </material_1.Typography>
                </material_1.Box>
              </material_1.TableCell>
              <material_1.TableCell>
                <material_1.Box>
                  <material_1.Typography variant="body2">
                    {doc.evaluatorName} {doc.evaluatorLastName}
                  </material_1.Typography>
                </material_1.Box>
              </material_1.TableCell>
              <material_1.TableCell>{formatDate(doc.date)}</material_1.TableCell>
              <material_1.TableCell>
                <material_1.Chip label={((_a = doc.hazards) === null || _a === void 0 ? void 0 : _a.length) || 0} color="primary" size="small"/>
              </material_1.TableCell>
              <material_1.TableCell>
                <material_1.Chip label={getMaxRisk(doc.hazards)} color={getRiskColor(getMaxRisk(doc.hazards))} size="small"/>
              </material_1.TableCell>
              <material_1.TableCell>
                <material_1.Box display="flex" gap={1}>
                  <material_1.Tooltip title="ნახვა">
                    <material_1.IconButton key={"view-".concat(doc.id)} size="small" onClick={function (e) {
                    e.stopPropagation();
                    handleSelect(doc);
                }}>
                      <icons_material_1.Visibility />
                    </material_1.IconButton>
                  </material_1.Tooltip>
                  <material_1.Tooltip title="რედაქტირება">
                    <material_1.IconButton key={"edit-".concat(doc.id)} size="small" onClick={function (e) { return handleEdit(e, doc); }}>
                      <icons_material_1.Edit />
                    </material_1.IconButton>
                  </material_1.Tooltip>
                  <material_1.Tooltip title="წაშლა">
                    <material_1.IconButton key={"delete-".concat(doc.id)} size="small" onClick={function (e) { return handleDelete(e, doc); }}>
                      <icons_material_1.Delete />
                    </material_1.IconButton>
                  </material_1.Tooltip>
                </material_1.Box>
              </material_1.TableCell>
            </material_1.TableRow>);
        })}
        </material_1.TableBody>
      </material_1.Table>
    </material_1.TableContainer>);
});
DocumentList.displayName = 'DocumentList';
exports.default = DocumentList;
