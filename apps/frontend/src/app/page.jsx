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
exports.default = Home;
var react_1 = __importStar(require("react"));
var material_1 = require("@mui/material");
var DocumentList_1 = require("../components/DocumentList");
var components_1 = require("../components");
var documentStore_1 = require("../store/documentStore");
function Home() {
    var _this = this;
    var _a = (0, documentStore_1.useDocumentStore)(), documents = _a.documents, createDocument = _a.createDocument, fetchDocuments = _a.fetchDocuments, updateDocument = _a.updateDocument, deleteDocument = _a.deleteDocument;
    var _b = (0, react_1.useState)(false), open = _b[0], setOpen = _b[1];
    var _c = (0, react_1.useState)(null), editDoc = _c[0], setEditDoc = _c[1];
    var _d = (0, react_1.useState)(null), selectedDocument = _d[0], setSelectedDocument = _d[1];
    var _e = (0, react_1.useState)(false), openForm = _e[0], setOpenForm = _e[1];
    react_1.default.useEffect(function () {
        fetchDocuments();
    }, [fetchDocuments]);
    var handleCreateDocument = (0, react_1.useCallback)(function (data) { return __awaiter(_this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, createDocument(data)];
                case 1:
                    _a.sent();
                    setOpen(false);
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error('დოკუმენტის შექმნის შეცდომა:', error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); }, [createDocument]);
    var handleEdit = (0, react_1.useCallback)(function (doc) {
        setEditDoc(doc);
        setOpen(true);
    }, []);
    var handleDelete = (0, react_1.useCallback)(function (doc) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, deleteDocument(doc.id)];
                case 1:
                    _a.sent();
                    fetchDocuments();
                    return [2 /*return*/];
            }
        });
    }); }, [deleteDocument, fetchDocuments]);
    var handleSelect = (0, react_1.useCallback)(function (doc) {
        setSelectedDocument(doc);
        setOpenForm(true);
    }, []);
    var handleCloseDialog = (0, react_1.useCallback)(function () {
        setOpen(false);
        setEditDoc(null);
    }, []);
    var handleCloseForm = (0, react_1.useCallback)(function () {
        setOpenForm(false);
        setSelectedDocument(null);
    }, []);
    // Convert Document to CreateDocumentDto format for form default values
    var convertDocumentToCreateDto = (0, react_1.useCallback)(function (doc) {
        return {
            evaluatorName: doc.evaluatorName,
            evaluatorLastName: doc.evaluatorLastName,
            objectName: doc.objectName,
            workDescription: doc.workDescription,
            date: doc.date,
            time: doc.time,
            hazards: doc.hazards.map(function (hazard) { return (__assign(__assign({}, hazard), { photos: [] // Convert string[] to File[] for form
             })); }),
            photos: [] // Convert string[] to File[] for form
        };
    }, []);
    var handleSubmit = (0, react_1.useCallback)(function (data) { return __awaiter(_this, void 0, void 0, function () {
        var updateData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!editDoc) return [3 /*break*/, 2];
                    updateData = {
                        id: editDoc.id,
                        evaluatorName: data.evaluatorName,
                        evaluatorLastName: data.evaluatorLastName,
                        objectName: data.objectName,
                        workDescription: data.workDescription,
                        date: data.date,
                        time: data.time,
                        hazards: data.hazards,
                        photos: [] // UpdateDocumentDto expects string[], not File[]
                    };
                    return [4 /*yield*/, updateDocument(updateData)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, handleCreateDocument(data)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    fetchDocuments();
                    return [2 /*return*/];
            }
        });
    }); }, [editDoc, updateDocument, handleCreateDocument, fetchDocuments]);
    return (<material_1.Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4 }}>
      <material_1.Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <material_1.Typography variant="h4">დოკუმენტების მართვა</material_1.Typography>
        <material_1.Button variant="contained" onClick={function () {
            setEditDoc(null);
            setOpen(true);
        }}>
          ახალი დოკუმენტი
        </material_1.Button>
      </material_1.Box>
      <DocumentList_1.DocumentList documents={documents} onEdit={handleEdit} onDelete={handleDelete} onSelect={handleSelect}/>
      
      {/* DocumentForm with built-in Dialog */}
      <components_1.DocumentForm defaultValues={editDoc ? convertDocumentToCreateDto(editDoc) : undefined} onSubmit={handleSubmit} onCancel={handleCloseDialog} open={open} onClose={handleCloseDialog}/>
      
      <material_1.Dialog open={openForm} onClose={handleCloseForm} maxWidth="lg" fullWidth>
        <material_1.DialogTitle>დოკუმენტის დეტალები</material_1.DialogTitle>
        <material_1.DialogContent>
          {selectedDocument && (<components_1.DocumentView document={selectedDocument} onEdit={function () {
                setEditDoc(selectedDocument);
                setOpenForm(false);
                setOpen(true);
            }} onDelete={function () {
                handleDelete(selectedDocument);
                setOpenForm(false);
            }}/>)}
        </material_1.DialogContent>
      </material_1.Dialog>
    </material_1.Box>);
}
