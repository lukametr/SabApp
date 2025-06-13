# @sabap/ui

საერთო UI კომპონენტები SabaP პროექტისთვის.

## 🚀 ინსტალაცია

```bash
pnpm add @sabap/ui
```

## 📦 შიგთავსი

### თემა

```typescript
import { createCustomTheme } from '@sabap/ui';
import { ThemeProvider } from '@mui/material/styles';

const theme = createCustomTheme({
  mode: 'light',
  primaryColor: '#1976d2',
  secondaryColor: '#dc004e',
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* თქვენი აპლიკაცია */}
    </ThemeProvider>
  );
}
```

### კომპონენტები

```typescript
import { Button, Card, Input } from '@sabap/ui';

function Example() {
  return (
    <Card className="p-4">
      <Input
        label="სახელი"
        placeholder="შეიყვანეთ სახელი"
      />
      <Button variant="contained" className="mt-4">
        შენახვა
      </Button>
    </Card>
  );
}
```

## 🛠 განვითარება

```bash
# დეველოპმენტ რეჟიმი
pnpm dev

# ბილდი
pnpm build

# ლინტინგი
pnpm lint
``` 