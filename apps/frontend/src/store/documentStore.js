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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDocumentStore = void 0;
var zustand_1 = require("zustand");
var documentApi_1 = require("../services/api/documentApi");
exports.useDocumentStore = (0, zustand_1.create)(function (set) { return ({
    documents: [],
    selectedDocument: null,
    isLoading: false,
    error: null,
    fetchDocuments: function () { return __awaiter(void 0, void 0, void 0, function () {
        var documents, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    set({ isLoading: true, error: null });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, documentApi_1.documentApi.getAll()];
                case 2:
                    documents = _a.sent();
                    set({ documents: documents, isLoading: false });
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    set({ error: 'დოკუმენტების ჩატვირთვა ვერ მოხერხდა', isLoading: false });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    fetchMyDocuments: function () { return __awaiter(void 0, void 0, void 0, function () {
        var documents, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    set({ isLoading: true, error: null });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, documentApi_1.documentApi.getMyDocuments()];
                case 2:
                    documents = _a.sent();
                    set({ documents: documents, isLoading: false });
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    set({ error: 'დოკუმენტების ჩატვირთვა ვერ მოხერხდა', isLoading: false });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    getDocument: function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var document_1, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    set({ isLoading: true, error: null });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, documentApi_1.documentApi.getById(id)];
                case 2:
                    document_1 = _a.sent();
                    set({ selectedDocument: document_1, isLoading: false });
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    set({ error: 'დოკუმენტის ჩატვირთვა ვერ მოხერხდა', isLoading: false });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    createDocument: function (data, file) { return __awaiter(void 0, void 0, void 0, function () {
        var response_1, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    set({ isLoading: true, error: null });
                    console.log('დოკუმენტის შექმნა:', data, file);
                    return [4 /*yield*/, documentApi_1.documentApi.create(data)];
                case 1:
                    response_1 = _a.sent();
                    console.log('პასუხი:', response_1);
                    set(function (state) { return ({
                        documents: __spreadArray(__spreadArray([], state.documents, true), [response_1], false),
                        isLoading: false
                    }); });
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _a.sent();
                    console.error('დოკუმენტის შექმნის შეცდომა:', error_4);
                    set({ isLoading: false, error: 'დოკუმენტის შექმნა ვერ მოხერხდა' });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    updateDocument: function (data) { return __awaiter(void 0, void 0, void 0, function () {
        var updatedDocument_1, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    set({ isLoading: true, error: null });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, documentApi_1.documentApi.update(data)];
                case 2:
                    updatedDocument_1 = _a.sent();
                    set(function (state) {
                        var _a;
                        return ({
                            documents: state.documents.map(function (doc) {
                                return doc.id === data.id ? updatedDocument_1 : doc;
                            }),
                            selectedDocument: ((_a = state.selectedDocument) === null || _a === void 0 ? void 0 : _a.id) === data.id ? updatedDocument_1 : state.selectedDocument,
                            isLoading: false
                        });
                    });
                    return [3 /*break*/, 4];
                case 3:
                    error_5 = _a.sent();
                    set({ error: 'დოკუმენტის განახლება ვერ მოხერხდა', isLoading: false });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    deleteDocument: function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    set({ isLoading: true, error: null });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, documentApi_1.documentApi.delete(id)];
                case 2:
                    _a.sent();
                    set(function (state) {
                        var _a;
                        return ({
                            documents: state.documents.filter(function (doc) { return doc.id !== id; }),
                            selectedDocument: ((_a = state.selectedDocument) === null || _a === void 0 ? void 0 : _a.id) === id ? null : state.selectedDocument,
                            isLoading: false
                        });
                    });
                    return [3 /*break*/, 4];
                case 3:
                    error_6 = _a.sent();
                    set({ error: 'დოკუმენტის წაშლა ვერ მოხერხდა', isLoading: false });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    toggleFavorite: function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var updatedDocument_2, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    set({ isLoading: true, error: null });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, documentApi_1.documentApi.toggleFavorite(id)];
                case 2:
                    updatedDocument_2 = _a.sent();
                    set(function (state) {
                        var _a;
                        return ({
                            documents: state.documents.map(function (doc) {
                                return doc.id === id ? updatedDocument_2 : doc;
                            }),
                            selectedDocument: ((_a = state.selectedDocument) === null || _a === void 0 ? void 0 : _a.id) === id ? updatedDocument_2 : state.selectedDocument,
                            isLoading: false
                        });
                    });
                    return [3 /*break*/, 4];
                case 3:
                    error_7 = _a.sent();
                    set({ error: 'დოკუმენტის სტატუსის განახლება ვერ მოხერხდა', isLoading: false });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    updateAssessment: function (id, assessmentA, assessmentSh, assessmentR) { return __awaiter(void 0, void 0, void 0, function () {
        var updatedDocument_3, error_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    set({ isLoading: true, error: null });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, documentApi_1.documentApi.updateAssessment(id, assessmentA, assessmentSh, assessmentR)];
                case 2:
                    updatedDocument_3 = _a.sent();
                    set(function (state) {
                        var _a;
                        return ({
                            documents: state.documents.map(function (doc) {
                                return doc.id === id ? updatedDocument_3 : doc;
                            }),
                            selectedDocument: ((_a = state.selectedDocument) === null || _a === void 0 ? void 0 : _a.id) === id ? updatedDocument_3 : state.selectedDocument,
                            isLoading: false
                        });
                    });
                    return [3 /*break*/, 4];
                case 3:
                    error_8 = _a.sent();
                    set({ error: 'შეფასების განახლება ვერ მოხერხდა', isLoading: false });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    downloadDocument: function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var blob, error_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    set({ isLoading: true, error: null });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, documentApi_1.documentApi.downloadDocument(id)];
                case 2:
                    blob = _a.sent();
                    set({ isLoading: false });
                    return [2 /*return*/, blob];
                case 3:
                    error_9 = _a.sent();
                    set({ error: 'დოკუმენტის ჩამოტვირთვა ვერ მოხერხდა', isLoading: false });
                    throw error_9;
                case 4: return [2 /*return*/];
            }
        });
    }); },
    downloadMultipleDocuments: function (ids) { return __awaiter(void 0, void 0, void 0, function () {
        var blob, error_10;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    set({ isLoading: true, error: null });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, documentApi_1.documentApi.downloadMultipleDocuments(ids)];
                case 2:
                    blob = _a.sent();
                    set({ isLoading: false });
                    return [2 /*return*/, blob];
                case 3:
                    error_10 = _a.sent();
                    set({ error: 'დოკუმენტების ჩამოტვირთვა ვერ მოხერხდა', isLoading: false });
                    throw error_10;
                case 4: return [2 /*return*/];
            }
        });
    }); },
    setSelectedDocument: function (document) {
        set({ selectedDocument: document });
    },
}); });
