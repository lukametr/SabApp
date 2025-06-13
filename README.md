# SabApp - უსაფრთხოების შეფასების სისტემა

## აღწერა
SabApp არის ვებ-აპლიკაცია, რომელიც საშუალებას გაძლევთ შეაფასოთ სამუშაო ადგილის უსაფრთხოება და შექმნათ შესაბამისი დოკუმენტაცია.

## ფუნქციონალი
- დოკუმენტების შექმნა და მართვა
- რისკების შეფასება
- ფოტოების ატვირთვა
- დოკუმენტების ექსპორტი
- მონაცემთა ბაზის ინტეგრაცია

## ტექნოლოგიები
- Frontend: Next.js, TypeScript, Material-UI
- Backend: Node.js, Express, TypeScript
- Database: MongoDB Atlas
- Deployment: Render

## ინსტალაცია

### მოთხოვნები
- Node.js 18+
- pnpm
- MongoDB Atlas ანგარიში

### ლოკალური განვითარება
1. რეპოზიტორიის კლონირება:
```bash
git clone https://github.com/lukametr/SabApp.git
cd SabApp
```

2. დამოკიდებულებებების დაინსტალირება:
```bash
pnpm install
```

3. გარემოს ცვლადების კონფიგურაცია:
- შექმენით `.env` ფაილი `apps/backend` დირექტორიაში:
```
PORT=3003
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

4. სერვერის გაშვება:
```bash
# ბექენდის გაშვება
cd apps/backend
pnpm dev

# ფრონტენდის გაშვება
cd apps/frontend
pnpm dev
```

## დეპლოი
აპლიკაცია დეპლოირებულია Render-ზე:
- Frontend: https://saba-app.onrender.com
- Backend: https://saba-api.onrender.com

## ლიცენზია
MIT 