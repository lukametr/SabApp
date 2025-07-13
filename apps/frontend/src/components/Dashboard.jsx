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
exports.default = Dashboard;
var react_1 = __importStar(require("react"));
var material_1 = require("@mui/material");
var icons_material_1 = require("@mui/icons-material");
var navigation_1 = require("next/navigation");
var DocumentList_1 = __importDefault(require("./DocumentList"));
var DocumentForm_1 = __importDefault(require("./DocumentForm"));
var DocumentView_1 = __importDefault(require("./DocumentView"));
var SubscriptionBanner_1 = __importDefault(require("./subscription/SubscriptionBanner"));
var documentStore_1 = require("../store/documentStore");
var authStore_1 = require("../store/authStore");
function Dashboard(_a) {
    var _this = this;
    var propUser = _a.user;
    var router = (0, navigation_1.useRouter)();
    var _b = (0, documentStore_1.useDocumentStore)(), documents = _b.documents, createDocument = _b.createDocument, fetchDocuments = _b.fetchDocuments, updateDocument = _b.updateDocument, deleteDocument = _b.deleteDocument;
    var _c = (0, authStore_1.useAuthStore)(), user = _c.user, logout = _c.logout, loadFromStorage = _c.loadFromStorage;
    // Use auth store user if available, otherwise use prop user
    var currentUser = user || propUser;
    var _d = (0, react_1.useState)(false), open = _d[0], setOpen = _d[1];
    var _e = (0, react_1.useState)(null), editDoc = _e[0], setEditDoc = _e[1];
    var _f = (0, react_1.useState)(null), viewDoc = _f[0], setViewDoc = _f[1];
    var _g = (0, react_1.useState)(null), selectedDocument = _g[0], setSelectedDocument = _g[1];
    var _h = (0, react_1.useState)(false), openForm = _h[0], setOpenForm = _h[1];
    var _j = (0, react_1.useState)(null), anchorEl = _j[0], setAnchorEl = _j[1];
    // Load user from storage on mount
    react_1.default.useEffect(function () {
        loadFromStorage();
    }, []); // Only on mount
    // Debug: Log user data when it changes
    react_1.default.useEffect(function () {
        console.log('🔍 Dashboard - Current User:', currentUser);
        console.log('🔍 Dashboard - User Role:', currentUser === null || currentUser === void 0 ? void 0 : currentUser.role);
        console.log('🔍 Dashboard - Is Admin?:', (currentUser === null || currentUser === void 0 ? void 0 : currentUser.role) === 'admin');
    }, [currentUser]);
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
                case 0:
                    console.log('🗑️ Dashboard delete called for:', { id: doc.id, objectName: doc.objectName });
                    return [4 /*yield*/, deleteDocument(doc.id)];
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
    var handleMenuOpen = function (event) {
        setAnchorEl(event.currentTarget);
    };
    var handleMenuClose = function () {
        setAnchorEl(null);
    };
    var handleLogout = function () {
        logout();
        router.push('/');
    };
    var handleClearCache = function () {
        localStorage.clear();
        window.location.reload();
    };
    var convertDocumentToCreateDto = (0, react_1.useCallback)(function (doc) {
        return {
            evaluatorName: doc.evaluatorName,
            evaluatorLastName: doc.evaluatorLastName,
            objectName: doc.objectName,
            workDescription: doc.workDescription,
            date: doc.date,
            time: doc.time,
            hazards: doc.hazards.map(function (hazard) { return (__assign(__assign({}, hazard), { photos: [] })); }),
            photos: []
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
                        photos: []
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
    // Stats calculation
    var totalDocuments = documents.length;
    var totalHazards = documents.reduce(function (sum, doc) { var _a; return sum + (((_a = doc.hazards) === null || _a === void 0 ? void 0 : _a.length) || 0); }, 0);
    var recentDocuments = documents.filter(function (doc) {
        var docDate = new Date(doc.createdAt || doc.date);
        var weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return docDate > weekAgo;
    }).length;
    return (<material_1.Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <material_1.AppBar position="static" elevation={0}>
        <material_1.Toolbar>
          <material_1.Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <icons_material_1.Shield sx={{ mr: 1 }}/>
            <material_1.Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
              SabApp
            </material_1.Typography>
          </material_1.Box>
          <material_1.Box sx={{ display: 'flex', alignItems: 'center' }}>
            <material_1.Typography variant="body1" sx={{ mr: 2 }}>
              {(currentUser === null || currentUser === void 0 ? void 0 : currentUser.name) || 'მომხმარებელი'}
            </material_1.Typography>
            <material_1.IconButton size="large" color="inherit" onClick={handleMenuOpen}>
              <icons_material_1.AccountCircle />
            </material_1.IconButton>
            <material_1.Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              {/* Debug: Show current user info */}
              <material_1.MenuItem disabled>
                <material_1.Typography variant="caption">
                  Role: {(currentUser === null || currentUser === void 0 ? void 0 : currentUser.role) || 'undefined'} | Admin: {(currentUser === null || currentUser === void 0 ? void 0 : currentUser.role) === 'admin' ? 'Yes' : 'No'}
                </material_1.Typography>
              </material_1.MenuItem>
              {(currentUser === null || currentUser === void 0 ? void 0 : currentUser.role) === 'admin' && (<material_1.MenuItem onClick={function () { return router.push('/admin'); }}>
                  <icons_material_1.AdminPanelSettings sx={{ mr: 1 }}/>
                  Admin Panel
                </material_1.MenuItem>)}
              <material_1.MenuItem onClick={handleClearCache}>
                <icons_material_1.Security sx={{ mr: 1 }}/>
                Clear Cache
              </material_1.MenuItem>
              <material_1.MenuItem onClick={handleLogout}>
                <icons_material_1.Logout sx={{ mr: 1 }}/>
                გამოსვლა
              </material_1.MenuItem>
            </material_1.Menu>
          </material_1.Box>
        </material_1.Toolbar>
      </material_1.AppBar>

      <material_1.Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Subscription Banner */}
        <SubscriptionBanner_1.default />
        
        {/* Admin Panel Access - Prominent Card for Admin Users */}
        {(currentUser === null || currentUser === void 0 ? void 0 : currentUser.role) === 'admin' && (<material_1.Paper elevation={3} sx={{
                p: 3,
                mb: 4,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
            }}>
            <material_1.Box sx={{ position: 'relative', zIndex: 1 }}>
              <material_1.Grid container alignItems="center" spacing={3}>
                <material_1.Grid item xs={12} md={8}>
                  <material_1.Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <icons_material_1.AdminPanelSettings sx={{ fontSize: 40, mr: 2 }}/>
                    <material_1.Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      Admin Panel
                    </material_1.Typography>
                  </material_1.Box>
                  <material_1.Typography variant="h6" sx={{ mb: 1, opacity: 0.9 }}>
                    მომხმარებლების მართვა და გამოწერების კონტროლი
                  </material_1.Typography>
                  <material_1.Typography variant="body1" sx={{ opacity: 0.8 }}>
                    დაამატეთ, ჩაშალეთ ან განაახლეთ მომხმარებლების გამოწერები, ნახეთ სისტემის სტატისტიკა
                  </material_1.Typography>
                </material_1.Grid>
                <material_1.Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                  <material_1.Button variant="contained" size="large" onClick={function () { return router.push('/admin'); }} sx={{
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.3)',
                },
                fontSize: '1.1rem',
                px: 4,
                py: 1.5,
                borderRadius: 2
            }} startIcon={<icons_material_1.AdminPanelSettings />}>
                    Admin Panel-ში გადასვლა
                  </material_1.Button>
                </material_1.Grid>
              </material_1.Grid>
            </material_1.Box>
            {/* Decorative background elements */}
            <material_1.Box sx={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 200,
                height: 200,
                borderRadius: '50%',
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                zIndex: 0
            }}/>
            <material_1.Box sx={{
                position: 'absolute',
                bottom: -30,
                left: -30,
                width: 150,
                height: 150,
                borderRadius: '50%',
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                zIndex: 0
            }}/>
          </material_1.Paper>)}
        
        {/* Stats Cards */}
        <material_1.Grid container spacing={3} sx={{ mb: 4 }}>
          <material_1.Grid item xs={12} sm={6} md={3}>
            <material_1.Card elevation={2}>
              <material_1.CardContent sx={{ textAlign: 'center' }}>
                <icons_material_1.Assignment sx={{ fontSize: 40, color: 'primary.main', mb: 1 }}/>
                <material_1.Typography variant="h4" color="primary">
                  {totalDocuments}
                </material_1.Typography>
                <material_1.Typography variant="body2" color="text.secondary">
                  სულ დოკუმენტი
                </material_1.Typography>
              </material_1.CardContent>
            </material_1.Card>
          </material_1.Grid>
          <material_1.Grid item xs={12} sm={6} md={3}>
            <material_1.Card elevation={2}>
              <material_1.CardContent sx={{ textAlign: 'center' }}>
                <icons_material_1.Security sx={{ fontSize: 40, color: 'warning.main', mb: 1 }}/>
                <material_1.Typography variant="h4" color="warning.main">
                  {totalHazards}
                </material_1.Typography>
                <material_1.Typography variant="body2" color="text.secondary">
                  გამოვლენილი საფრთხე
                </material_1.Typography>
              </material_1.CardContent>
            </material_1.Card>
          </material_1.Grid>
          <material_1.Grid item xs={12} sm={6} md={3}>
            <material_1.Card elevation={2}>
              <material_1.CardContent sx={{ textAlign: 'center' }}>
                <icons_material_1.GetApp sx={{ fontSize: 40, color: 'success.main', mb: 1 }}/>
                <material_1.Typography variant="h4" color="success.main">
                  {totalDocuments * 3}
                </material_1.Typography>
                <material_1.Typography variant="body2" color="text.secondary">
                  ჩამოტვირთვა
                </material_1.Typography>
              </material_1.CardContent>
            </material_1.Card>
          </material_1.Grid>
          <material_1.Grid item xs={12} sm={6} md={3}>
            <material_1.Card elevation={2}>
              <material_1.CardContent sx={{ textAlign: 'center' }}>
                <icons_material_1.Add sx={{ fontSize: 40, color: 'info.main', mb: 1 }}/>
                <material_1.Typography variant="h4" color="info.main">
                  {recentDocuments}
                </material_1.Typography>
                <material_1.Typography variant="body2" color="text.secondary">
                  ბოლო კვირაში
                </material_1.Typography>
              </material_1.CardContent>
            </material_1.Card>
          </material_1.Grid>
        </material_1.Grid>

        {/* Main Content */}
        <material_1.Paper elevation={1} sx={{ p: 3 }}>
          <material_1.Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <material_1.Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              თქვენი დოკუმენტები
            </material_1.Typography>
            <material_1.Button variant="contained" startIcon={<icons_material_1.Add />} onClick={function () {
            setEditDoc(null);
            setOpen(true);
        }} size="large">
              ახალი დოკუმენტი
            </material_1.Button>
          </material_1.Box>

          {documents.length === 0 ? (<material_1.Box sx={{ textAlign: 'center', py: 8 }}>
              <icons_material_1.Assignment sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }}/>
              <material_1.Typography variant="h6" color="text.secondary" gutterBottom>
                ჯერ არ გაქვთ შექმნილი დოკუმენტები
              </material_1.Typography>
              <material_1.Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                დაიწყეთ პირველი უსაფრთხოების შეფასების შექმნა
              </material_1.Typography>
              <material_1.Button variant="contained" startIcon={<icons_material_1.Add />} onClick={function () {
                setEditDoc(null);
                setOpen(true);
            }}>
                შექმენი პირველი დოკუმენტი
              </material_1.Button>
            </material_1.Box>) : (<DocumentList_1.default documents={documents} onEdit={handleEdit} onDelete={handleDelete} onSelect={handleSelect}/>)}
        </material_1.Paper>
      </material_1.Container>
      
      {/* DocumentForm with built-in Dialog */}
      <DocumentForm_1.default defaultValues={editDoc ? convertDocumentToCreateDto(editDoc) : undefined} onSubmit={handleSubmit} onCancel={handleCloseDialog} open={open} onClose={handleCloseDialog}/>
      
      {/* Document View Dialog */}
      <material_1.Dialog open={openForm} onClose={handleCloseForm} maxWidth="lg" fullWidth>
        <material_1.DialogTitle>დოკუმენტის დეტალები</material_1.DialogTitle>
        <material_1.DialogContent>
          {selectedDocument && (<DocumentView_1.default document={selectedDocument} onEdit={function () {
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
