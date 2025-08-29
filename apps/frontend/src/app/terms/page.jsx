'use strict';
'use client';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.default = TermsPage;
var react_1 = __importDefault(require('react'));
var material_1 = require('@mui/material');
var navigation_1 = require('next/navigation');
function TermsPage() {
  var router = (0, navigation_1.useRouter)();
  return (
    <material_1.Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', py: 4 }}>
      <material_1.Container maxWidth="md">
        <material_1.Paper elevation={3} sx={{ p: 4 }}>
          <material_1.Typography variant="h3" component="h1" gutterBottom align="center">
            წესები და პირობები
          </material_1.Typography>

          <material_1.Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            1. ზოგადი დებულებები
          </material_1.Typography>
          <material_1.Typography variant="body1" paragraph>
            ჩვენი პლატფორმის გამოყენებით თქვენ ეთანხმებით ქვემოთ მოცემულ წესებსა და პირობებს. ეს
            პლატფორმა შექმნილია უსაფრთხოების ოფიცრებისთვის დოკუმენტების მართვისა და შეფასების
            ფორმების შესავსებად.
          </material_1.Typography>

          <material_1.Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            2. მომხმარებლის უფლებები და მოვალეობები
          </material_1.Typography>
          <material_1.Typography variant="body1" paragraph>
            • თქვენ ვალდებული ხართ მიაწოდოთ ზუსტი და სწორი ინფორმაცია რეგისტრაციისას
          </material_1.Typography>
          <material_1.Typography variant="body1" paragraph>
            • პლატფორმის გამოყენება მხოლოდ კანონიერი მიზნებისთვის
          </material_1.Typography>
          <material_1.Typography variant="body1" paragraph>
            • სხვისი ანგარიშის გამოყენება აკრძალულია
          </material_1.Typography>
          <material_1.Typography variant="body1" paragraph>
            • თქვენი ანგარიშის უსაფრთხოება თქვენი პასუხისმგებლობაა
          </material_1.Typography>

          <material_1.Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            3. მონაცემთა დაცვა
          </material_1.Typography>
          <material_1.Typography variant="body1" paragraph>
            ჩვენ ვიცავთ თქვენს პირად მონაცემებს საქართველოს კანონმდებლობის შესაბამისად. თქვენი
            მონაცემები გამოიყენება მხოლოდ სერვისის გაუმჯობესების მიზნით.
          </material_1.Typography>

          <material_1.Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            4. დოკუმენტების მართვა
          </material_1.Typography>
          <material_1.Typography variant="body1" paragraph>
            • შექმნილი დოკუმენტები მიეკუთვნება მომხმარებელს
          </material_1.Typography>
          <material_1.Typography variant="body1" paragraph>
            • თითოეული მომხმარებელი წვდომას იღებს მხოლოდ საკუთარ დოკუმენტებზე
          </material_1.Typography>
          <material_1.Typography variant="body1" paragraph>
            • პლატფორმა არ არის პასუხისმგებელი დოკუმენტების შინაარსზე
          </material_1.Typography>

          <material_1.Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            5. სერვისის ხელმისაწვდომობა
          </material_1.Typography>
          <material_1.Typography variant="body1" paragraph>
            ჩვენ ვცდილობთ უზრუნველვყოთ სერვისის 24/7 ხელმისაწვდომობა, მაგრამ ვერ გავრანტებთ 100%
            ხელმისაწვდომობას ტექნიკური სამუშაოების ან სხვა გაუთვალისწინებელი გარემოებების გამო.
          </material_1.Typography>

          <material_1.Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            6. პასუხისმგებლობის შეზღუდვა
          </material_1.Typography>
          <material_1.Typography variant="body1" paragraph>
            პლატფორმა არ არის პასუხისმგებელი პირდაპირ ან არაპირდაპირ ზიანზე, რომელიც შეიძლება
            წარმოიშვას პლატფორმის გამოყენების შედეგად.
          </material_1.Typography>

          <material_1.Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            7. ცვლილებები
          </material_1.Typography>
          <material_1.Typography variant="body1" paragraph>
            ჩვენ ვიტოვებთ უფლებას შევცვალოთ ეს წესები და პირობები ნებისმიერ დროს. მნიშვნელოვანი
            ცვლილებების შემთხვევაში მომხმარებლები იქნებიან გაფრთხილებული.
          </material_1.Typography>

          <material_1.Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            8. კონტაქტი
          </material_1.Typography>
          <material_1.Typography variant="body1" paragraph>
            კითხვების შემთხვევაში დაგვიკავშირდით: info@sabap.ge
          </material_1.Typography>

          <material_1.Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 4, textAlign: 'center' }}
          >
            ბოლო განახლება: 2025 წლის 7 იანვარი
          </material_1.Typography>

          <material_1.Box sx={{ textAlign: 'center', mt: 4 }}>
            <material_1.Button
              variant="contained"
              onClick={function () {
                return router.back();
              }}
              sx={{ px: 4 }}
            >
              უკან დაბრუნება
            </material_1.Button>
          </material_1.Box>
        </material_1.Paper>
      </material_1.Container>
    </material_1.Box>
  );
}
