"use strict";
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DocumentForm;
var react_1 = __importStar(require("react"));
var image_1 = __importDefault(require("next/image"));
var material_1 = require("@mui/material");
var PhotoCamera_1 = __importDefault(require("@mui/icons-material/PhotoCamera"));
var ExpandMore_1 = __importDefault(require("@mui/icons-material/ExpandMore"));
var react_hook_form_1 = require("react-hook-form");
var x_date_pickers_1 = require("@mui/x-date-pickers");
var AdapterDateFns_1 = require("@mui/x-date-pickers/AdapterDateFns");
var locale_1 = require("date-fns/locale");
var icons_material_1 = require("@mui/icons-material");
var PERSONS = [
    'დასაქმებული',
    'ვიზიტორი',
    'კონტრაქტორი',
    'სხვა პირი',
    'ყველა',
];
var riskOptions = [0, 1, 2, 3, 4, 5];
function HazardSection(_a) {
    var _this = this;
    var hazards = _a.hazards, onHazardsChange = _a.onHazardsChange;
    var _b = (0, react_1.useState)(null), expandedHazard = _b[0], setExpandedHazard = _b[1];
    var _c = (0, react_1.useState)(null), cameraActive = _c[0], setCameraActive = _c[1];
    var _d = (0, react_1.useState)(null), stream = _d[0], setStream = _d[1];
    var videoRef = (0, react_1.useRef)(null);
    var fileInputRef = (0, react_1.useRef)(null);
    var addHazard = function () {
        var newHazard = {
            id: Date.now().toString(),
            hazardIdentification: '',
            affectedPersons: [],
            injuryDescription: '',
            existingControlMeasures: '',
            initialRisk: { probability: 0, severity: 0, total: 0 },
            additionalControlMeasures: '',
            residualRisk: { probability: 0, severity: 0, total: 0 },
            requiredMeasures: '',
            responsiblePerson: '',
            reviewDate: null, // Start with null for DatePicker
            photos: []
        };
        console.log('✅ Added new hazard:', newHazard.id);
        onHazardsChange(__spreadArray(__spreadArray([], hazards, true), [newHazard], false));
        setExpandedHazard(newHazard.id);
    };
    var removeHazard = function (id) {
        onHazardsChange(hazards.filter(function (h) { return h.id !== id; }));
    };
    var updateHazard = function (id, updates) {
        onHazardsChange(hazards.map(function (h) { return h.id === id ? __assign(__assign({}, h), updates) : h; }));
    };
    var handleCamera = function (hazardId) { return __awaiter(_this, void 0, void 0, function () {
        var mediaStream, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!(cameraActive !== hazardId)) return [3 /*break*/, 5];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, navigator.mediaDevices.getUserMedia({ video: true })];
                case 2:
                    mediaStream = _b.sent();
                    setStream(mediaStream);
                    setCameraActive(hazardId);
                    if (videoRef.current) {
                        videoRef.current.srcObject = mediaStream;
                    }
                    return [3 /*break*/, 4];
                case 3:
                    _a = _b.sent();
                    alert('კამერასთან წვდომა ვერ მოხერხდა');
                    return [3 /*break*/, 4];
                case 4: return [3 /*break*/, 6];
                case 5:
                    if (stream) {
                        stream.getTracks().forEach(function (track) { return track.stop(); });
                    }
                    setCameraActive(null);
                    _b.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var handleCapture = function (hazardId) {
        var _a;
        if (videoRef.current) {
            var canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            (_a = canvas.getContext('2d')) === null || _a === void 0 ? void 0 : _a.drawImage(videoRef.current, 0, 0);
            canvas.toBlob(function (blob) {
                if (blob) {
                    // Convert blob to base64 data URL instead of blob URL
                    var reader_1 = new FileReader();
                    reader_1.onloadend = function () {
                        var base64DataUrl = reader_1.result;
                        var capturedFile = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
                        console.log('📸 Captured photo:', { base64DataUrl: base64DataUrl.substring(0, 50) + '...' });
                        var hazard = hazards.find(function (h) { return h.id === hazardId; });
                        if (hazard) {
                            updateHazard(hazardId, {
                                mediaFile: capturedFile,
                                mediaPreview: base64DataUrl // Use base64 data URL instead of blob URL
                            });
                        }
                    };
                    reader_1.onerror = function (error) {
                        console.error('Error reading captured photo:', error);
                    };
                    reader_1.readAsDataURL(blob);
                }
            }, 'image/jpeg');
        }
        if (stream) {
            stream.getTracks().forEach(function (track) { return track.stop(); });
        }
        setCameraActive(null);
    };
    var handleFileChange = function (hazardId, e) {
        var _a;
        var f = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (f) {
            var hazard = hazards.find(function (h) { return h.id === hazardId; });
            if (hazard) {
                // Convert file to base64 data URL for preview
                var reader_2 = new FileReader();
                reader_2.onloadend = function () {
                    var base64DataUrl = reader_2.result;
                    console.log('📁 File uploaded:', { fileName: f.name, base64DataUrl: base64DataUrl.substring(0, 50) + '...' });
                    updateHazard(hazardId, {
                        mediaFile: f,
                        mediaPreview: base64DataUrl // Use base64 data URL instead of blob URL
                    });
                };
                reader_2.onerror = function (error) {
                    console.error('Error reading file:', error);
                };
                reader_2.readAsDataURL(f);
            }
        }
    };
    var handlePersonChange = function (hazardId, person) {
        var hazard = hazards.find(function (h) { return h.id === hazardId; });
        if (hazard) {
            var updated = [];
            if (person === 'ყველა') {
                // თუ "ყველა" მონიშნულია/არ არის მონიშნული
                if (hazard.affectedPersons.includes('ყველა')) {
                    // თუ "ყველა" უკვე მონიშნულია, მაშინ გავუქმოთ ყველაფერი
                    updated = [];
                }
                else {
                    // თუ "ყველა" არ არის მონიშნული, მაშინ დავამატოთ ყველა
                    updated = __spreadArray([], PERSONS, true);
                }
            }
            else {
                // სხვა პუნქტების შემთხვევაში
                if (hazard.affectedPersons.includes('ყველა')) {
                    // თუ "ყველა" მონიშნულია, მაშინ ამოვიღოთ "ყველა" და დავტოვოთ მხოლოდ ეს პუნქტი
                    updated = [person];
                }
                else {
                    // ჩვეულებრივი ლოგიკა
                    updated = hazard.affectedPersons.includes(person)
                        ? hazard.affectedPersons.filter(function (p) { return p !== person; })
                        : __spreadArray(__spreadArray([], hazard.affectedPersons, true), [person], false);
                }
            }
            updateHazard(hazardId, { affectedPersons: updated });
        }
    };
    return (<material_1.Box>
      <material_1.Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <material_1.Typography variant="h6" fontWeight={600}>
          საფრთხეთა იდენტიფიკაცია
        </material_1.Typography>
        <material_1.Button variant="contained" startIcon={<icons_material_1.Add />} onClick={addHazard}>
          ახალი საფრთხე
        </material_1.Button>
      </material_1.Box>

      {hazards.map(function (hazard, index) { return (<material_1.Accordion key={hazard.id} expanded={expandedHazard === hazard.id} onChange={function () { return setExpandedHazard(expandedHazard === hazard.id ? null : hazard.id); }} sx={{ mb: 2 }}>
          <material_1.AccordionSummary expandIcon={<ExpandMore_1.default />}>
            <material_1.Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
              <material_1.Typography>
                საფრთხე #{index + 1}: {hazard.hazardIdentification || 'შევსებული არ არის'}
              </material_1.Typography>
              <material_1.IconButton onClick={function (e) {
                e.stopPropagation();
                removeHazard(hazard.id);
            }} color="error" size="small">
                <icons_material_1.Delete />
              </material_1.IconButton>
            </material_1.Box>
          </material_1.AccordionSummary>
          <material_1.AccordionDetails>
            <material_1.Grid container spacing={2}>
              <material_1.Grid item xs={12}>
                <material_1.TextField label="საფრთხის იდენტიფიკაცია" fullWidth multiline rows={2} value={hazard.hazardIdentification} onChange={function (e) { return updateHazard(hazard.id, { hazardIdentification: e.target.value }); }}/>
              </material_1.Grid>

              <material_1.Grid item xs={12}>
                <material_1.Typography fontWeight={500} mb={1}>ამსახველი ფოტო/ვიდეო მასალა</material_1.Typography>
                <material_1.Box display="flex" gap={2} alignItems="center">
                  <material_1.Button variant="outlined" onClick={function () { return handleCamera(hazard.id); }} startIcon={<PhotoCamera_1.default />} sx={{ minWidth: 0 }}>
                    კამერა
                  </material_1.Button>
                  <material_1.Button variant="outlined" onClick={function () { var _a; return (_a = fileInputRef.current) === null || _a === void 0 ? void 0 : _a.click(); }} sx={{ minWidth: 0 }}>
                    ატვირთვა
                  </material_1.Button>
                  <input type="file" ref={fileInputRef} accept="image/*,video/*" style={{ display: 'none' }} onChange={function (e) { return handleFileChange(hazard.id, e); }}/>
                  {hazard.mediaPreview && (<material_1.Chip label="ფაილი დამატებულია" color="success" onDelete={function () { return updateHazard(hazard.id, { mediaFile: undefined, mediaPreview: undefined }); }}/>)}
                </material_1.Box>
                {cameraActive === hazard.id && (<material_1.Box mt={2}>
                    <video ref={videoRef} autoPlay width={300} height={200} style={{ borderRadius: 8 }}/>
                    <material_1.Button onClick={function () { return handleCapture(hazard.id); }} variant="contained" sx={{ mt: 1 }}>
                      გადაღება
                    </material_1.Button>
                  </material_1.Box>)}
                {hazard.mediaPreview && cameraActive !== hazard.id && (<material_1.Box mt={2}>
                    <image_1.default src={hazard.mediaPreview} alt="preview" width={200} height={150} unoptimized style={{ maxWidth: 200, borderRadius: 8, objectFit: 'cover' }} onLoad={function () { return console.log('✅ Preview image loaded for hazard:', hazard.id); }} onError={function (e) { return console.error('❌ Preview image failed to load:', e); }}/>
                  </material_1.Box>)}
                {/* Show existing saved photos (base64) */}
                {hazard.photos && hazard.photos.length > 0 && !hazard.mediaPreview && (<material_1.Box mt={2}>
                    <material_1.Typography variant="body2" mb={1}>შენახული ფოტოები:</material_1.Typography>
                    <material_1.Box display="flex" flexWrap="wrap" gap={1}>
                      {hazard.photos.map(function (base64Photo, index) { return (<material_1.Box key={index} position="relative">
                          <image_1.default src={base64Photo} // base64 data URL
                 alt={"\u10E4\u10DD\u10E2\u10DD ".concat(index + 1)} width={150} height={120} unoptimized style={{ maxWidth: 150, borderRadius: 8, objectFit: 'cover' }}/>
                          <material_1.IconButton size="small" onClick={function () {
                        var updatedPhotos = hazard.photos.filter(function (_, i) { return i !== index; });
                        updateHazard(hazard.id, { photos: updatedPhotos });
                    }} sx={{
                        position: 'absolute',
                        top: 2,
                        right: 2,
                        bgcolor: 'rgba(255, 255, 255, 0.8)',
                        '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' }
                    }}>
                            <icons_material_1.Delete fontSize="small"/>
                          </material_1.IconButton>
                        </material_1.Box>); })}
                    </material_1.Box>
                  </material_1.Box>)}
              </material_1.Grid>

              <material_1.Grid item xs={12}>
                <material_1.Typography fontWeight={500} mb={1}>პირთა წრე</material_1.Typography>
                <material_1.Box display="flex" flexWrap="wrap" gap={1}>
                  {PERSONS.map(function (person) { return (<material_1.FormControlLabel key={person} control={<material_1.Checkbox checked={hazard.affectedPersons.includes(person)} onChange={function () { return handlePersonChange(hazard.id, person); }}/>} label={person}/>); })}
                </material_1.Box>
              </material_1.Grid>

              <material_1.Grid item xs={12}>
                <material_1.TextField label="დაშავებულის დაზიანება" fullWidth multiline rows={2} value={hazard.injuryDescription} onChange={function (e) { return updateHazard(hazard.id, { injuryDescription: e.target.value }); }}/>
              </material_1.Grid>

              <material_1.Grid item xs={12}>
                <material_1.TextField label="არსებული კონტროლის ზომები" fullWidth multiline rows={2} value={hazard.existingControlMeasures} onChange={function (e) { return updateHazard(hazard.id, { existingControlMeasures: e.target.value }); }}/>
              </material_1.Grid>

              <material_1.Grid item xs={12}>
                <material_1.Typography fontWeight={500} mb={1}>საწყისი რისკი</material_1.Typography>
                <material_1.Box display="flex" gap={2}>
                  <material_1.TextField select label="ალბათობა" SelectProps={{ native: true }} sx={{ minWidth: 100 }} value={hazard.initialRisk.probability} onChange={function (e) {
                var prob = Number(e.target.value);
                var total = prob * hazard.initialRisk.severity;
                updateHazard(hazard.id, {
                    initialRisk: __assign(__assign({}, hazard.initialRisk), { probability: prob, total: total })
                });
            }}>
                    {riskOptions.map(function (opt) { return <option key={opt} value={opt}>{opt}</option>; })}
                  </material_1.TextField>
                  <material_1.TextField select label="სიმძიმე" SelectProps={{ native: true }} sx={{ minWidth: 100 }} value={hazard.initialRisk.severity} onChange={function (e) {
                var sev = Number(e.target.value);
                var total = hazard.initialRisk.probability * sev;
                updateHazard(hazard.id, {
                    initialRisk: __assign(__assign({}, hazard.initialRisk), { severity: sev, total: total })
                });
            }}>
                    {riskOptions.map(function (opt) { return <option key={opt} value={opt}>{opt}</option>; })}
                  </material_1.TextField>
                  <material_1.TextField label="ჯამი" value={hazard.initialRisk.total} InputProps={{ readOnly: true }} sx={{ minWidth: 100 }}/>
                </material_1.Box>
              </material_1.Grid>

              <material_1.Grid item xs={12}>
                <material_1.TextField label="დამატებითი კონტროლის ზომები" fullWidth multiline rows={2} value={hazard.additionalControlMeasures} onChange={function (e) { return updateHazard(hazard.id, { additionalControlMeasures: e.target.value }); }}/>
              </material_1.Grid>

              <material_1.Grid item xs={12}>
                <material_1.Typography fontWeight={500} mb={1}>ნარჩენი რისკი</material_1.Typography>
                <material_1.Box display="flex" gap={2}>
                  <material_1.TextField select label="ალბათობა" SelectProps={{ native: true }} sx={{ minWidth: 100 }} value={hazard.residualRisk.probability} onChange={function (e) {
                var prob = Number(e.target.value);
                var total = prob * hazard.residualRisk.severity;
                updateHazard(hazard.id, {
                    residualRisk: __assign(__assign({}, hazard.residualRisk), { probability: prob, total: total })
                });
            }}>
                    {riskOptions.map(function (opt) { return <option key={opt} value={opt}>{opt}</option>; })}
                  </material_1.TextField>
                  <material_1.TextField select label="სიმძიმე" SelectProps={{ native: true }} sx={{ minWidth: 100 }} value={hazard.residualRisk.severity} onChange={function (e) {
                var sev = Number(e.target.value);
                var total = hazard.residualRisk.probability * sev;
                updateHazard(hazard.id, {
                    residualRisk: __assign(__assign({}, hazard.residualRisk), { severity: sev, total: total })
                });
            }}>
                    {riskOptions.map(function (opt) { return <option key={opt} value={opt}>{opt}</option>; })}
                  </material_1.TextField>
                  <material_1.TextField label="ჯამი" value={hazard.residualRisk.total} InputProps={{ readOnly: true }} sx={{ minWidth: 100 }}/>
                </material_1.Box>
                {hazard.residualRisk.total >= 9 && (<material_1.Alert severity="warning" sx={{ mt: 1 }}>
                    საჭიროა დამატებითი კონტროლის ზომები
                  </material_1.Alert>)}
              </material_1.Grid>

              <material_1.Grid item xs={12}>
                <material_1.TextField label="გასატარებელი ზომები/რეაგირება" fullWidth multiline rows={2} value={hazard.requiredMeasures} onChange={function (e) { return updateHazard(hazard.id, { requiredMeasures: e.target.value }); }}/>
              </material_1.Grid>

              <material_1.Grid item xs={12}>
                <material_1.TextField label="შესრულებაზე პასუხისმგებელი" fullWidth value={hazard.responsiblePerson} onChange={function (e) { return updateHazard(hazard.id, { responsiblePerson: e.target.value }); }}/>
              </material_1.Grid>

              <material_1.Grid item xs={12}>
                <x_date_pickers_1.LocalizationProvider dateAdapter={AdapterDateFns_1.AdapterDateFns} adapterLocale={locale_1.ka}>
                  <x_date_pickers_1.DatePicker label="გადახედვის სავარაუდო დრო" value={hazard.reviewDate} onChange={function (date) { return updateHazard(hazard.id, { reviewDate: date }); }} slotProps={{
                textField: {
                    fullWidth: true,
                    required: false // Allow empty initially
                }
            }}/>
                </x_date_pickers_1.LocalizationProvider>
              </material_1.Grid>
            </material_1.Grid>
          </material_1.AccordionDetails>
        </material_1.Accordion>); })}
    </material_1.Box>);
}
function DocumentForm(_a) {
    var _this = this;
    var handleFormSubmit = _a.onSubmit, onCancel = _a.onCancel, defaultValues = _a.defaultValues, open = _a.open, onClose = _a.onClose;
    var _b = (0, react_1.useState)([]), hazards = _b[0], setHazards = _b[1];
    var _c = (0, react_1.useState)(false), isInitialized = _c[0], setIsInitialized = _c[1];
    var _d = (0, react_hook_form_1.useForm)({
        defaultValues: {
            evaluatorName: '',
            evaluatorLastName: '',
            objectName: '',
            workDescription: '',
            date: new Date(),
            time: new Date(),
            hazards: [],
            photos: []
        },
    }), control = _d.control, submitForm = _d.handleSubmit, errors = _d.formState.errors, reset = _d.reset;
    // Update form values when defaultValues change or when dialog opens
    (0, react_1.useEffect)(function () {
        var _a;
        if (open && !isInitialized) {
            setIsInitialized(true);
            if (defaultValues) {
                console.log('🔄 DocumentForm received defaultValues:', defaultValues);
                console.log('🔄 Hazards from defaultValues:', defaultValues.hazards);
                // Convert hazards to internal format
                var formattedHazards = (defaultValues.hazards || []).map(function (hazard, index) {
                    console.log("\uD83D\uDD04 Processing hazard ".concat(index, ":"), hazard);
                    return {
                        id: hazard.id || "hazard_".concat(Date.now(), "_").concat(Math.random()),
                        hazardIdentification: hazard.hazardIdentification || '',
                        affectedPersons: hazard.affectedPersons || [],
                        injuryDescription: hazard.injuryDescription || '',
                        existingControlMeasures: hazard.existingControlMeasures || '',
                        initialRisk: hazard.initialRisk || { probability: 0, severity: 0, total: 0 },
                        additionalControlMeasures: hazard.additionalControlMeasures || '',
                        residualRisk: hazard.residualRisk || { probability: 0, severity: 0, total: 0 },
                        requiredMeasures: hazard.requiredMeasures || '',
                        responsiblePerson: hazard.responsiblePerson || '',
                        reviewDate: hazard.reviewDate ? new Date(hazard.reviewDate) : null, // Keep null if no date
                        photos: hazard.photos || []
                    };
                });
                setHazards(formattedHazards);
                // Reset form with new values
                reset({
                    evaluatorName: defaultValues.evaluatorName || '',
                    evaluatorLastName: defaultValues.evaluatorLastName || '',
                    objectName: defaultValues.objectName || '',
                    workDescription: defaultValues.workDescription || '',
                    date: defaultValues.date ? new Date(defaultValues.date) : new Date(),
                    time: defaultValues.time ? new Date(defaultValues.time) : new Date(),
                    hazards: formattedHazards,
                    photos: defaultValues.photos || []
                });
                console.log('✅ Form reset with values:', {
                    evaluatorName: defaultValues.evaluatorName,
                    hazardsCount: formattedHazards.length,
                    photosCount: ((_a = defaultValues.photos) === null || _a === void 0 ? void 0 : _a.length) || 0
                });
            }
            else {
                // Reset to empty form for new document
                console.log('🆕 Creating new document - resetting form');
                setHazards([]);
                reset({
                    evaluatorName: '',
                    evaluatorLastName: '',
                    objectName: '',
                    workDescription: '',
                    date: new Date(),
                    time: new Date(),
                    hazards: [],
                    photos: []
                });
            }
        }
        // Reset initialization flag when dialog closes
        if (!open && isInitialized) {
            setIsInitialized(false);
        }
    }, [defaultValues, open, isInitialized]); // Add isInitialized to dependencies
    var handleFormSubmitInternal = function (data) { return __awaiter(_this, void 0, void 0, function () {
        var formattedData, error_1;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    // ვალიდაცია - მინიმუმ ერთი საფრთხე უნდა იყოს
                    if (hazards.length === 0) {
                        alert('გთხოვთ დაამატოთ მინიმუმ ერთი საფრთხე');
                        return [2 /*return*/];
                    }
                    // ველების ვალიდაცია
                    if (!((_a = data.evaluatorName) === null || _a === void 0 ? void 0 : _a.trim()) || !((_b = data.evaluatorLastName) === null || _b === void 0 ? void 0 : _b.trim()) ||
                        !((_c = data.objectName) === null || _c === void 0 ? void 0 : _c.trim()) || !((_d = data.workDescription) === null || _d === void 0 ? void 0 : _d.trim())) {
                        alert('გთხოვთ შეავსოთ ყველა სავალდებულო ველი');
                        return [2 /*return*/];
                    }
                    formattedData = __assign(__assign({}, data), { hazards: hazards });
                    console.log('📊 Form submission data:', {
                        hazardsCount: hazards.length,
                        hazardPhotos: hazards.map(function (h) { return ({
                            id: h.id,
                            hasMediaFile: !!h.mediaFile,
                            hasMediaPreview: !!h.mediaPreview
                        }); })
                    });
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, handleFormSubmit(formattedData)];
                case 2:
                    _e.sent();
                    // Don't clean state on successful submit - just close dialog
                    handleDialogClose();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _e.sent();
                    console.error('ფორმის გაგზავნის შეცდომა:', error_1);
                    alert('დოკუმენტის შენახვისას მოხდა შეცდომა');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    // Function to handle dialog close without cleanup (for successful submissions)
    var handleDialogClose = function () {
        onClose();
    };
    // Function to handle dialog close and cleanup (for cancel/escape)
    var handleCloseWithCleanup = function () {
        // Clean up form state only when explicitly closing/canceling
        setHazards([]);
        setIsInitialized(false);
        reset({
            evaluatorName: '',
            evaluatorLastName: '',
            objectName: '',
            workDescription: '',
            date: new Date(),
            time: new Date(),
            hazards: [],
            photos: []
        });
        onClose();
    };
    // Function to handle cancel
    var handleCancel = function () {
        setHazards([]);
        setIsInitialized(false);
        if (onCancel) {
            onCancel();
        }
        else {
            handleCloseWithCleanup();
        }
    };
    return (<material_1.Dialog open={open} onClose={handleCloseWithCleanup} maxWidth="md" fullWidth aria-labelledby="document-form-dialog" disableRestoreFocus>
      <material_1.DialogTitle id="document-form-dialog">
        <material_1.Box display="flex" justifyContent="space-between" alignItems="center">
          <material_1.Typography variant="h5" fontWeight={600}>
        {defaultValues ? 'დოკუმენტის რედაქტირება' : 'ახალი დოკუმენტი'}
          </material_1.Typography>
          <material_1.Box sx={{ display: 'flex', gap: 2 }}>
            <material_1.Button variant="outlined" onClick={handleCancel}>
              გაუქმება
            </material_1.Button>
            <material_1.Button variant="contained" onClick={submitForm(handleFormSubmitInternal)}>
              {defaultValues ? 'განახლება' : 'შენახვა'}
            </material_1.Button>
          </material_1.Box>
        </material_1.Box>
      </material_1.DialogTitle>
      <material_1.DialogContent>
        <material_1.Box component="form" onSubmit={submitForm(handleFormSubmitInternal)} noValidate sx={{ mt: 2 }} role="form" tabIndex={-1}>
          <material_1.Grid container spacing={2}>
            <material_1.Grid item xs={12} sm={6}>
              <react_hook_form_1.Controller name="evaluatorName" control={control} rules={{ required: true }} render={function (_a) {
            var field = _a.field;
            return (<material_1.TextField {...field} label="შემფასებლის სახელი" fullWidth required error={!!errors.evaluatorName}/>);
        }}/>
            </material_1.Grid>
            <material_1.Grid item xs={12} sm={6}>
              <react_hook_form_1.Controller name="evaluatorLastName" control={control} rules={{ required: true }} render={function (_a) {
            var field = _a.field;
            return (<material_1.TextField {...field} label="შემფასებლის გვარი" fullWidth required error={!!errors.evaluatorLastName}/>);
        }}/>
            </material_1.Grid>
            <material_1.Grid item xs={12}>
              <react_hook_form_1.Controller name="objectName" control={control} rules={{ required: true }} render={function (_a) {
            var field = _a.field;
            return (<material_1.TextField {...field} label="ობიექტის დასახელება" fullWidth required error={!!errors.objectName}/>);
        }}/>
            </material_1.Grid>
            <material_1.Grid item xs={12}>
              <react_hook_form_1.Controller name="workDescription" control={control} rules={{ required: true }} render={function (_a) {
            var field = _a.field;
            return (<material_1.TextField {...field} label="სამუშაოს მოკლე აღწერა" fullWidth required multiline rows={2} error={!!errors.workDescription}/>);
        }}/>
            </material_1.Grid>
            <material_1.Grid item xs={6}>
              <x_date_pickers_1.LocalizationProvider dateAdapter={AdapterDateFns_1.AdapterDateFns} adapterLocale={locale_1.ka}>
                <react_hook_form_1.Controller name="date" control={control} rules={{ required: true }} render={function (_a) {
            var field = _a.field;
            return (<x_date_pickers_1.DatePicker label="თარიღი" {...field} slotProps={{
                    textField: {
                        fullWidth: true,
                        required: true,
                        error: !!errors.date
                    }
                }}/>);
        }}/>
              </x_date_pickers_1.LocalizationProvider>
            </material_1.Grid>
            <material_1.Grid item xs={6}>
              <x_date_pickers_1.LocalizationProvider dateAdapter={AdapterDateFns_1.AdapterDateFns} adapterLocale={locale_1.ka}>
                <react_hook_form_1.Controller name="time" control={control} rules={{ required: true }} render={function (_a) {
            var field = _a.field;
            return (<x_date_pickers_1.TimePicker label="დრო" {...field} slotProps={{
                    textField: {
                        fullWidth: true,
                        required: true,
                        error: !!errors.time
                    }
                }}/>);
        }}/>
              </x_date_pickers_1.LocalizationProvider>
            </material_1.Grid>
            <material_1.Grid item xs={12}>
              <HazardSection hazards={hazards} onHazardsChange={setHazards}/>
            </material_1.Grid>
            <material_1.Grid item xs={12}>
              <material_1.Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                <material_1.Button variant="outlined" onClick={handleCancel}>
                  გაუქმება
                </material_1.Button>
                <material_1.Button type="submit" variant="contained">
                  {defaultValues ? 'განახლება' : 'შენახვა'}
                </material_1.Button>
              </material_1.Box>
            </material_1.Grid>
          </material_1.Grid>
        </material_1.Box>
      </material_1.DialogContent>
    </material_1.Dialog>);
}
