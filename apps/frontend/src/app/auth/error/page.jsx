"use strict";
'use client';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AuthErrorPage;
var react_1 = __importDefault(require("react"));
var navigation_1 = require("next/navigation");
var material_1 = require("@mui/material");
var icons_material_1 = require("@mui/icons-material");
function AuthErrorPage() {
    var searchParams = (0, navigation_1.useSearchParams)();
    var router = (0, navigation_1.useRouter)();
    var error = searchParams.get('error');
    var getErrorMessage = function (error) {
        switch (error) {
            case 'Configuration':
                return 'ავტენტიფიკაციის კონფიგურაციის შეცდომა. გთხოვ, მიმართეთ ადმინისტრაციას.';
            case 'AccessDenied':
                return 'წვდომა უარყოფილია. შესაძლოა არ გაქვთ საკმარისი უფლებები.';
            case 'Verification':
                return 'ვერიფიკაციის შეცდომა. გთხოვ, სცადეთ ხელახლა.';
            case 'Default':
                return 'ავტენტიფიკაციის შეცდომა. გთხოვ, სცადეთ ხელახლა.';
            case 'OAuthSignin':
                return 'Google-ით შესვლის შეცდომა. შეამოწმეთ თქვენი Google ანგარიში.';
            case 'OAuthCallback':
                return 'Google ავტენტიფიკაციის callback შეცდომა.';
            case 'OAuthCreateAccount':
                return 'Google ანგარიშის შექმნის შეცდომა.';
            case 'EmailCreateAccount':
                return 'ელ. ფოსტით ანგარიშის შექმნის შეცდომა.';
            case 'Callback':
                return 'ავტენტიფიკაციის callback შეცდომა.';
            case 'OAuthAccountNotLinked':
                return 'ეს Google ანგარიში უკვე დაკავშირებულია სხვა ანგარიშთან.';
            case 'EmailSignin':
                return 'ელ. ფოსტით შესვლის შეცდომა.';
            case 'CredentialsSignin':
                return 'არასწორი მეილი ან პაროლი.';
            case 'SessionRequired':
                return 'ავტორიზაცია საჭიროა ამ გვერდთან წვდომისთვის.';
            default:
                return error || 'უცნობი ავტენტიფიკაციის შეცდომა.';
        }
    };
    return (<material_1.Box sx={{
            minHeight: '100vh',
            backgroundColor: '#f5f5f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: 4
        }}>
      <material_1.Container maxWidth="sm">
        <material_1.Paper elevation={3} sx={{ p: 4 }}>
          <material_1.Box sx={{ textAlign: 'center', mb: 4 }}>
            <icons_material_1.Error sx={{ fontSize: 48, color: 'error.main', mb: 2 }}/>
            <material_1.Typography variant="h4" gutterBottom>
              ავტენტიფიკაციის შეცდომა
            </material_1.Typography>
          </material_1.Box>

          <material_1.Alert severity="error" sx={{ mb: 3 }}>
            {getErrorMessage(error)}
          </material_1.Alert>

          {error && (<material_1.Box sx={{ mb: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <material_1.Typography variant="caption" color="text.secondary">
                შეცდომის კოდი: {error}
              </material_1.Typography>
            </material_1.Box>)}

          <material_1.Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <material_1.Button variant="contained" onClick={function () { return router.push('/auth/login'); }}>
              შესვლის გვერდზე დაბრუნება
            </material_1.Button>
            <material_1.Button variant="outlined" onClick={function () { return router.push('/'); }}>
              მთავარ გვერდზე
            </material_1.Button>
          </material_1.Box>
        </material_1.Paper>
      </material_1.Container>
    </material_1.Box>);
}
