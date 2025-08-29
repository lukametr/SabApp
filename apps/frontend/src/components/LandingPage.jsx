'use strict';
'use client';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  (function () {
    var ownKeys = function (o) {
      ownKeys =
        Object.getOwnPropertyNames ||
        function (o) {
          var ar = [];
          for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
          return ar;
        };
      return ownKeys(o);
    };
    return function (mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null)
        for (var k = ownKeys(mod), i = 0; i < k.length; i++)
          if (k[i] !== 'default') __createBinding(result, mod, k[i]);
      __setModuleDefault(result, mod);
      return result;
    };
  })();
Object.defineProperty(exports, '__esModule', { value: true });
exports.default = LandingPage;
var react_1 = __importStar(require('react'));
var material_1 = require('@mui/material');
var icons_material_1 = require('@mui/icons-material');
var navigation_1 = require('next/navigation');
var authStore_1 = require('../store/authStore');
function LandingPage() {
  var theme = (0, material_1.useTheme)();
  var router = (0, navigation_1.useRouter)();
  var searchParams = (0, navigation_1.useSearchParams)();
  var user = (0, authStore_1.useAuthStore)().user;
  var _a = (0, react_1.useState)(null),
    error = _a[0],
    setError = _a[1];
  (0, react_1.useEffect)(
    function () {
      // Check for error parameter
      var errorParam = searchParams.get('error');
      if (errorParam) {
        setError(decodeURIComponent(errorParam));
        // Clean URL after showing error
        var url = new URL(window.location.href);
        url.searchParams.delete('error');
        window.history.replaceState({}, '', url.toString());
      }
    },
    [searchParams]
  );
  var handleGetStarted = function () {
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/auth/login');
    }
  };
  var steps = [
    {
      icon: <icons_material_1.Security sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'დარეგისტრირდი',
      description: 'შექმენი ანგარიში უსაფრთხოების პლატფორმაზე',
    },
    {
      icon: (
        <icons_material_1.Assignment sx={{ fontSize: 40, color: theme.palette.primary.main }} />
      ),
      title: 'შეავსე ფორმა',
      description: 'დეტალურად შეაფასე ობიექტი და საფრთხეები',
    },
    {
      icon: <icons_material_1.GetApp sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'გადმოწერე',
      description: 'ფორმები PDF/Excel ფორმატში',
    },
  ];
  var features = [
    {
      icon: <icons_material_1.Speed sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'დროის ეკონომია',
      description: 'სწრაფი ფორმების შევსება და გადმოწერა',
    },
    {
      icon: <icons_material_1.Phone sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'მობილური წვდომა',
      description: 'მუშაობს ყველა მოწყობილობაზე',
    },
    {
      icon: <icons_material_1.Shield sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'უსაფრთხო შენახვა',
      description: 'თქვენი მონაცემები დაცულია',
    },
    {
      icon: (
        <icons_material_1.Assignment sx={{ fontSize: 40, color: theme.palette.primary.main }} />
      ),
      title: 'ავტომატური ფორმატირება',
      description: 'პროფესიონალური PDF დოკუმენტები',
    },
  ];
  return (
    <material_1.Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Error Alert */}
      {error && (
        <material_1.Container maxWidth="lg" sx={{ pt: 2 }}>
          <material_1.Alert
            severity="error"
            onClose={function () {
              return setError(null);
            }}
          >
            {error}
          </material_1.Alert>
        </material_1.Container>
      )}

      {/* Hero Section */}
      <material_1.Box
        sx={{
          backgroundColor: 'white',
          py: 8,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        }}
      >
        <material_1.Container maxWidth="lg">
          <material_1.Grid container spacing={4} alignItems="center">
            <material_1.Grid item xs={12} md={6}>
              <material_1.Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={{ fontWeight: 'bold' }}
              >
                შეაფასე უსაფრთხოება ციფრულად
              </material_1.Typography>
              <material_1.Typography
                variant="h6"
                component="p"
                gutterBottom
                sx={{ mb: 4, opacity: 0.9 }}
              >
                შეავსე, შეინახე და გააზიარე შენივე შემოწმების ფორმები ონლაინ რეჟიმში
              </material_1.Typography>
              <material_1.Button
                variant="contained"
                size="large"
                onClick={handleGetStarted}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': { bgcolor: 'grey.100' },
                  py: 2,
                  px: 4,
                }}
                endIcon={<icons_material_1.ArrowForward />}
              >
                {user ? 'სამუშაო სივრცე' : 'დაიწყე ახლავე'}
              </material_1.Button>
            </material_1.Grid>
            <material_1.Grid item xs={12} md={6}>
              <material_1.Box
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: 2,
                  p: 4,
                  textAlign: 'center',
                }}
              >
                <icons_material_1.Security sx={{ fontSize: 120, opacity: 0.8 }} />
                <material_1.Typography variant="h6" sx={{ mt: 2 }}>
                  უსაფრთხოების შეფასება
                </material_1.Typography>
              </material_1.Box>
            </material_1.Grid>
          </material_1.Grid>
        </material_1.Container>
      </material_1.Box>

      {/* Steps Section */}
      <material_1.Box sx={{ py: 8 }}>
        <material_1.Container maxWidth="lg">
          <material_1.Typography variant="h3" align="center" gutterBottom sx={{ mb: 6 }}>
            როგორ მუშაობს სისტემა
          </material_1.Typography>
          <material_1.Grid container spacing={4}>
            {steps.map(function (step, index) {
              return (
                <material_1.Grid item xs={12} md={4} key={index}>
                  <material_1.Card elevation={2} sx={{ textAlign: 'center', p: 3, height: '100%' }}>
                    <material_1.CardContent>
                      <material_1.Box sx={{ mb: 2 }}>
                        <material_1.Chip
                          label={index + 1}
                          color="primary"
                          sx={{ mb: 2, fontSize: 18, fontWeight: 'bold' }}
                        />
                        {step.icon}
                      </material_1.Box>
                      <material_1.Typography variant="h5" gutterBottom>
                        {step.title}
                      </material_1.Typography>
                      <material_1.Typography variant="body1" color="text.secondary">
                        {step.description}
                      </material_1.Typography>
                    </material_1.CardContent>
                  </material_1.Card>
                </material_1.Grid>
              );
            })}
          </material_1.Grid>
        </material_1.Container>
      </material_1.Box>

      {/* Features Section */}
      <material_1.Box id="about" sx={{ py: 8, backgroundColor: 'white' }}>
        <material_1.Container maxWidth="lg">
          <material_1.Typography variant="h3" align="center" gutterBottom sx={{ mb: 6 }}>
            რატომ ჩვენ?
          </material_1.Typography>
          <material_1.Grid container spacing={4}>
            {features.map(function (feature, index) {
              return (
                <material_1.Grid item xs={12} sm={6} md={3} key={index}>
                  <material_1.Card elevation={1} sx={{ textAlign: 'center', p: 3, height: '100%' }}>
                    <material_1.CardContent>
                      <material_1.Box sx={{ mb: 2 }}>{feature.icon}</material_1.Box>
                      <material_1.Typography variant="h6" gutterBottom>
                        {feature.title}
                      </material_1.Typography>
                      <material_1.Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </material_1.Typography>
                    </material_1.CardContent>
                  </material_1.Card>
                </material_1.Grid>
              );
            })}
          </material_1.Grid>
        </material_1.Container>
      </material_1.Box>

      {/* Demo Section */}
      <material_1.Box id="demo" sx={{ py: 8, backgroundColor: '#f9f9f9' }}>
        <material_1.Container maxWidth="lg">
          <material_1.Typography variant="h3" align="center" gutterBottom sx={{ mb: 6 }}>
            ნიმუშის ხილვა
          </material_1.Typography>
          <material_1.Grid container spacing={4}>
            <material_1.Grid item xs={12} md={6}>
              <material_1.Card elevation={3}>
                <material_1.CardContent sx={{ p: 4 }}>
                  <material_1.Typography variant="h6" gutterBottom>
                    ფორმის შევსების მაგალითი - თ.
                  </material_1.Typography>
                  <material_1.Box
                    sx={{
                      backgroundColor: '#f5f5f5',
                      p: 3,
                      borderRadius: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                    }}
                  >
                    <material_1.Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <material_1.Typography variant="body2" color="text.secondary">
                        შემფასებელი:
                      </material_1.Typography>
                      <material_1.Typography variant="body2">გიორგი ბერიძე</material_1.Typography>
                    </material_1.Box>
                    <material_1.Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <material_1.Typography variant="body2" color="text.secondary">
                        ობიექტი:
                      </material_1.Typography>
                      <material_1.Typography variant="body2">ოფისი №1</material_1.Typography>
                    </material_1.Box>
                    <material_1.Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <material_1.Typography variant="body2" color="text.secondary">
                        საფრთხეები:
                      </material_1.Typography>
                      <material_1.Typography variant="body2">5 გამოვლენილი</material_1.Typography>
                    </material_1.Box>
                  </material_1.Box>
                </material_1.CardContent>
              </material_1.Card>
            </material_1.Grid>
            <material_1.Grid item xs={12} md={6}>
              <material_1.Card elevation={3}>
                <material_1.CardContent sx={{ p: 4 }}>
                  <material_1.Typography variant="h6" gutterBottom>
                    გადმოწერილი დოკუმენტი
                  </material_1.Typography>
                  <material_1.Box
                    sx={{
                      backgroundColor: '#e3f2fd',
                      p: 3,
                      borderRadius: 1,
                      textAlign: 'center',
                    }}
                  >
                    <icons_material_1.GetApp
                      sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 2 }}
                    />
                    <material_1.Typography variant="body1" gutterBottom>
                      უსაფრთხოების_შეფასება.pdf
                    </material_1.Typography>
                    <material_1.Typography variant="body2" color="text.secondary">
                      პროფესიონალური ფორმატირება
                    </material_1.Typography>
                  </material_1.Box>
                </material_1.CardContent>
              </material_1.Card>
            </material_1.Grid>
          </material_1.Grid>
        </material_1.Container>
      </material_1.Box>

      {/* CTA Section - Only show for non-logged in users */}
      {!user && (
        <material_1.Box
          sx={{
            py: 8,
            backgroundColor: theme.palette.primary.main,
            color: 'white',
            textAlign: 'center',
          }}
        >
          <material_1.Container maxWidth="md">
            <material_1.Typography variant="h3" gutterBottom>
              დარეგისტრირდი ახლავე
            </material_1.Typography>
            <material_1.Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              შეავსე ფორმები სწრაფად და მარტივად
            </material_1.Typography>
            <material_1.Button
              variant="contained"
              size="large"
              onClick={handleGetStarted}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': { bgcolor: 'grey.100' },
                py: 2,
                px: 6,
              }}
            >
              რეგისტრაცია
            </material_1.Button>
          </material_1.Container>
        </material_1.Box>
      )}

      {/* Footer */}
      <material_1.Box sx={{ backgroundColor: '#333', color: 'white', py: 4 }}>
        <material_1.Container maxWidth="lg">
          <material_1.Grid container spacing={4}>
            <material_1.Grid item xs={12} md={4}>
              <material_1.Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <img src="/logo-3.jpg" alt="logo" style={{ height: 32, objectFit: 'contain' }} />
              </material_1.Box>
              <material_1.Typography variant="body2" color="grey.400">
                უსაფრთხოების შეფასების ციფრული პლატფორმა
              </material_1.Typography>
            </material_1.Grid>
            <material_1.Grid item xs={12} md={4}>
              <material_1.Typography variant="h6" gutterBottom>
                სერვისები
              </material_1.Typography>
              <material_1.Stack spacing={1}>
                <material_1.Typography variant="body2" color="grey.400">
                  შეფასების ფორმები
                </material_1.Typography>
                <material_1.Typography variant="body2" color="grey.400">
                  PDF რეპორტები
                </material_1.Typography>
                <material_1.Typography variant="body2" color="grey.400">
                  Excel ექსპორტი
                </material_1.Typography>
              </material_1.Stack>
            </material_1.Grid>
            <material_1.Grid item xs={12} md={4}>
              <material_1.Typography variant="h6" gutterBottom>
                კავშირი
              </material_1.Typography>
              <material_1.Stack spacing={1} id="contact">
                <material_1.Typography variant="body2" color="grey.400">
                  მხარდაჭერა
                </material_1.Typography>
                <material_1.Typography variant="body2" color="grey.400">
                  წესები და პირობები
                </material_1.Typography>
                <material_1.Typography variant="body2" color="grey.400">
                  კონფიდენციალურობა
                </material_1.Typography>
              </material_1.Stack>
            </material_1.Grid>
          </material_1.Grid>
        </material_1.Container>
      </material_1.Box>
    </material_1.Box>
  );
}
