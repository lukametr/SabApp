# @sabap/utils

საერთო უტილიტები SabaP პროექტისთვის.

## 🚀 ინსტალაცია

```bash
pnpm add @sabap/utils
```

## 📦 შიგთავსი

### თარიღების ფორმატირება

```typescript
import { formatDate, formatDateTime, formatTime } from '@sabap/utils';

formatDate('2024-03-15'); // "15 მარტი 2024"
formatDateTime('2024-03-15T14:30:00'); // "15 მარტი 2024 14:30"
formatTime('2024-03-15T14:30:00'); // "14:30"
```

### ვალიდაცია

```typescript
import { documentSchema, userSchema } from '@sabap/utils';

// დოკუმენტის ვალიდაცია
const document = documentSchema.parse({
  id: '123e4567-e89b-12d3-a456-426614174000',
  title: 'მაგალითი დოკუმენტი',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  status: 'draft',
  authorId: '123e4567-e89b-12d3-a456-426614174001',
});

// მომხმარებლის ვალიდაცია
const user = userSchema.parse({
  id: '123e4567-e89b-12d3-a456-426614174000',
  email: 'user@example.com',
  name: 'გიორგი',
  role: 'editor',
  createdAt: new Date().toISOString(),
});
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