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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DocumentsPage;
var react_1 = __importStar(require("react"));
var material_1 = require("@mui/material");
var icons_material_1 = require("@mui/icons-material");
var components_1 = require("../../components");
var documentStore_1 = require("../../store/documentStore");
function DocumentsPage() {
    var _this = this;
    var _a = (0, documentStore_1.useDocumentStore)(), documents = _a.documents, fetchDocuments = _a.fetchDocuments, createDocument = _a.createDocument, updateDocument = _a.updateDocument, deleteDocument = _a.deleteDocument;
    var _b = (0, react_1.useState)(false), isFormOpen = _b[0], setIsFormOpen = _b[1];
    var _c = (0, react_1.useState)(null), selectedDocument = _c[0], setSelectedDocument = _c[1];
    var _d = (0, react_1.useState)(false), isDeleteDialogOpen = _d[0], setIsDeleteDialogOpen = _d[1];
    var _e = (0, react_1.useState)(null), documentToDelete = _e[0], setDocumentToDelete = _e[1];
    (0, react_1.useEffect)(function () {
        fetchDocuments();
    }, [fetchDocuments]);
    var handleCreate = function (data) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, createDocument(data)];
                case 1:
                    _a.sent();
                    setIsFormOpen(false);
                    return [2 /*return*/];
            }
        });
    }); };
    var handleUpdate = function (data) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!selectedDocument) return [3 /*break*/, 2];
                    return [4 /*yield*/, updateDocument(__assign(__assign({}, data), { id: selectedDocument.id }))];
                case 1:
                    _a.sent();
                    setSelectedDocument(null);
                    setIsFormOpen(false);
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); };
    var handleDelete = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!documentToDelete) return [3 /*break*/, 2];
                    return [4 /*yield*/, deleteDocument(documentToDelete.id)];
                case 1:
                    _a.sent();
                    setDocumentToDelete(null);
                    setIsDeleteDialogOpen(false);
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); };
    var handleEdit = function (document) {
        setSelectedDocument(document);
        setIsFormOpen(true);
    };
    var handleDeleteClick = function (document) {
        setDocumentToDelete(document);
        setIsDeleteDialogOpen(true);
    };
    // ფუნქცია Document-ის CreateDocumentDto-ში გადასაყვანად
    var convertDocumentToCreateDto = function (doc) {
        return {
            evaluatorName: doc.evaluatorName,
            evaluatorLastName: doc.evaluatorLastName,
            objectName: doc.objectName,
            workDescription: doc.workDescription,
            date: doc.date,
            time: doc.time,
            hazards: doc.hazards.map(function (hazard) { return (__assign(__assign({}, hazard), { photos: [] // ფოტოები ცარიელია რედაქტირებისას
             })); }),
            photos: [] // ფოტოები ცარიელია რედაქტირებისას
        };
    };
    // უნივერსალური onSubmit ფუნქცია
    var handleFormSubmit = function (data) { return __awaiter(_this, void 0, void 0, function () {
        var updateData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!selectedDocument) return [3 /*break*/, 2];
                    updateData = {
                        id: selectedDocument.id,
                        evaluatorName: data.evaluatorName,
                        evaluatorLastName: data.evaluatorLastName,
                        objectName: data.objectName,
                        workDescription: data.workDescription,
                        date: data.date,
                        time: data.time,
                        hazards: data.hazards,
                        photos: [] // UpdateDocumentDto-ში photos არის string[]
                    };
                    return [4 /*yield*/, handleUpdate(updateData)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 2: 
                // შექმნის რეჟიმი
                return [4 /*yield*/, handleCreate(data)];
                case 3:
                    // შექმნის რეჟიმი
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return (<material_1.Box p={3}>
      <material_1.Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <h1>დოკუმენტები</h1>
        <material_1.Button variant="contained" color="primary" startIcon={<icons_material_1.Add />} onClick={function () {
            setSelectedDocument(null);
            setIsFormOpen(true);
        }}>
          ახალი დოკუმენტი
        </material_1.Button>
      </material_1.Box>

      <components_1.DocumentList documents={documents} onEdit={handleEdit} onDelete={handleDeleteClick}/>

      <components_1.DocumentForm open={isFormOpen} onClose={function () {
            setIsFormOpen(false);
            setSelectedDocument(null);
        }} defaultValues={selectedDocument ? convertDocumentToCreateDto(selectedDocument) : undefined} onSubmit={handleFormSubmit}/>

      <material_1.Dialog open={isDeleteDialogOpen} onClose={function () {
            setIsDeleteDialogOpen(false);
            setDocumentToDelete(null);
        }}>
        <material_1.DialogTitle>დოკუმენტის წაშლა</material_1.DialogTitle>
        <material_1.DialogContent>
          <p>დარწმუნებული ხართ, რომ გსურთ ამ დოკუმენტის წაშლა?</p>
        </material_1.DialogContent>
        <material_1.DialogActions>
          <material_1.Button onClick={function () {
            setIsDeleteDialogOpen(false);
            setDocumentToDelete(null);
        }}>
            გაუქმება
          </material_1.Button>
          <material_1.Button onClick={handleDelete} color="error">
            წაშლა
          </material_1.Button>
        </material_1.DialogActions>
      </material_1.Dialog>
    </material_1.Box>);
}
