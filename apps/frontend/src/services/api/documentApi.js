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
exports.documentApi = void 0;
var api_1 = __importDefault(require("../../lib/api"));
exports.documentApi = {
    getAll: function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api_1.default.get('/documents')];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response.data];
            }
        });
    }); },
    getMyDocuments: function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api_1.default.get('/documents/my')];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response.data];
            }
        });
    }); },
    getById: function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api_1.default.get("/documents/".concat(id))];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response.data];
            }
        });
    }); },
    create: function (data) { return __awaiter(void 0, void 0, void 0, function () {
        var formData, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    formData = new FormData();
                    // დავამატოთ ძირითადი ველები
                    formData.append('evaluatorName', data.evaluatorName);
                    formData.append('evaluatorLastName', data.evaluatorLastName);
                    formData.append('objectName', data.objectName);
                    formData.append('workDescription', data.workDescription);
                    formData.append('date', data.date.toISOString());
                    formData.append('time', data.time.toISOString());
                    // დავამატოთ საფრთხეები
                    data.hazards.forEach(function (hazard, hazardIndex) {
                        formData.append("hazards[".concat(hazardIndex, "][hazardIdentification]"), hazard.hazardIdentification);
                        formData.append("hazards[".concat(hazardIndex, "][injuryDescription]"), hazard.injuryDescription);
                        formData.append("hazards[".concat(hazardIndex, "][existingControlMeasures]"), hazard.existingControlMeasures);
                        formData.append("hazards[".concat(hazardIndex, "][additionalControlMeasures]"), hazard.additionalControlMeasures);
                        formData.append("hazards[".concat(hazardIndex, "][requiredMeasures]"), hazard.requiredMeasures);
                        formData.append("hazards[".concat(hazardIndex, "][responsiblePerson]"), hazard.responsiblePerson);
                        formData.append("hazards[".concat(hazardIndex, "][reviewDate]"), hazard.reviewDate.toISOString());
                        // დავამატოთ რისკები
                        formData.append("hazards[".concat(hazardIndex, "][initialRisk][probability]"), hazard.initialRisk.probability.toString());
                        formData.append("hazards[".concat(hazardIndex, "][initialRisk][severity]"), hazard.initialRisk.severity.toString());
                        formData.append("hazards[".concat(hazardIndex, "][initialRisk][total]"), hazard.initialRisk.total.toString());
                        formData.append("hazards[".concat(hazardIndex, "][residualRisk][probability]"), hazard.residualRisk.probability.toString());
                        formData.append("hazards[".concat(hazardIndex, "][residualRisk][severity]"), hazard.residualRisk.severity.toString());
                        formData.append("hazards[".concat(hazardIndex, "][residualRisk][total]"), hazard.residualRisk.total.toString());
                        // დავამატოთ დაზარალებული პირები
                        hazard.affectedPersons.forEach(function (person, personIndex) {
                            formData.append("hazards[".concat(hazardIndex, "][affectedPersons][").concat(personIndex, "]"), person);
                        });
                        // დავამატოთ ფოტოები
                        if (hazard.photos && Array.isArray(hazard.photos)) {
                            hazard.photos.forEach(function (photo, _photoIndex) {
                                if (photo instanceof File) {
                                    formData.append("hazardPhotos", photo);
                                }
                            });
                        }
                    });
                    return [4 /*yield*/, api_1.default.post('/documents', formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                        })];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response.data];
            }
        });
    }); },
    update: function (data) { return __awaiter(void 0, void 0, void 0, function () {
        var formData, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    formData = new FormData();
                    // დავამატოთ ყველა ველი FormData-ში
                    Object.entries(data).forEach(function (_a) {
                        var key = _a[0], value = _a[1];
                        if (value instanceof Date) {
                            formData.append(key, value.toISOString());
                        }
                        else if (typeof value === 'object' && value !== null) {
                            formData.append(key, JSON.stringify(value));
                        }
                        else if (Array.isArray(value)) {
                            value.forEach(function (item, index) {
                                formData.append("".concat(key, "[").concat(index, "]"), item);
                            });
                        }
                        else if (value !== undefined) {
                            formData.append(key, value.toString());
                        }
                    });
                    return [4 /*yield*/, api_1.default.patch("/documents/".concat(data.id), formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                        })];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response.data];
            }
        });
    }); },
    delete: function (id) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api_1.default.delete("/documents/".concat(id))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); },
    toggleFavorite: function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api_1.default.post("/documents/".concat(id, "/favorite"))];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response.data];
            }
        });
    }); },
    updateAssessment: function (id, assessmentA, assessmentSh, assessmentR) { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api_1.default.patch("/documents/".concat(id, "/assessment"), {
                        assessmentA: assessmentA,
                        assessmentSh: assessmentSh,
                        assessmentR: assessmentR,
                    })];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response.data];
            }
        });
    }); },
    downloadDocument: function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api_1.default.get("/documents/".concat(id, "/download"), {
                        responseType: 'blob',
                    })];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response.data];
            }
        });
    }); },
    downloadMultipleDocuments: function (ids) { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api_1.default.post('/documents/download-multiple', { ids: ids }, {
                        responseType: 'blob',
                    })];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response.data];
            }
        });
    }); },
};
