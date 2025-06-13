# დოკუმენტების მართვის სისტემა

ეს არის დოკუმენტების მართვის სისტემის ფრონტენდ ნაწილი, რომელიც შექმნილია Next.js-ის გამოყენებით.

## მოთხოვნები

- Node.js 18.0.0 ან უფრო მაღალი ვერსია
- npm 9.0.0 ან უფრო მაღალი ვერსია

## ინსტალაცია

1. დააინსტალირეთ დამოკიდებულებები:

```bash
npm install
```

2. შექმენით `.env.local` ფაილი და დაამატეთ შემდეგი ცვლადები:

```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## განვითარება

განვითარების სერვერის გაშვება:

```bash
npm run dev
```

აპლიკაცია ხელმისაწვდომი იქნება [http://localhost:3001](http://localhost:3001).

## აწყობა

აპლიკაციის აწყობა:

```bash
npm run build
```

## გაშვება

აწყობილი აპლიკაციის გაშვება:

```bash
npm start
```

## ლინტინგი

კოდის ლინტინგი:

```bash
npm run lint
```

## ტექნოლოგიები

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Material-UI](https://mui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Axios](https://axios-http.com/)
- [date-fns](https://date-fns.org/) 