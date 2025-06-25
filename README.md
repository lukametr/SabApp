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

## 🚀 Deployment on Render

This project is configured to deploy on Render as a single service that serves both frontend and backend.

### Prerequisites

1. MongoDB database (MongoDB Atlas recommended)
2. Render account

### Environment Variables

Set these environment variables in your Render service:

- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Set to "production"
- `PORT` - Set to 10000 (or let Render auto-assign)

### Deployment Steps

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Use the following settings:
   - **Build Command**: `pnpm install --frozen-lockfile && cd apps/frontend && pnpm build && cd ../backend && pnpm build`
   - **Start Command**: `cd apps/backend && pnpm start:prod`
   - **Health Check Path**: `/api/health`

### Architecture

- **Frontend**: Next.js with static export
- **Backend**: NestJS with MongoDB
- **Static Files**: Served by NestJS ServeStaticModule
- **API**: Available at `/api/*` endpoints

### Local Development

```bash
# Install dependencies
pnpm install

# Start development servers
pnpm dev

# Build for production
pnpm build
```

### API Endpoints

- `GET /` - Frontend application
- `GET /api/health` - Health check
- `GET /api/documents` - Get all documents
- `POST /api/documents` - Create new document
- `PUT /api/documents/:id` - Update document
- `DELETE /api/documents/:id` - Delete document

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