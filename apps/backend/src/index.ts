import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectMongo } from './db';
import documentRoutes from './routes/documents';
import healthRoutes from './routes/health';

// გარემოს ცვლადების ჩატვირთვა
dotenv.config();

const app = express();
const port = process.env.PORT || 3003;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://saba-app.onrender.com' 
    : 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// მონაცემთა ბაზასთან დაკავშირება
const startServer = async () => {
  try {
    await connectMongo();
    console.log('მონაცემთა ბაზასთან დაკავშირება წარმატებულია');
    
    // მარშრუტები
    app.use('/api', documentRoutes);
    app.use('/api', healthRoutes);

    // Error handling
    app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error(err.stack);
      res.status(500).json({ error: 'სერვერის შეცდომა' });
    });

    // სერვერის გაშვება
    app.listen(port, () => {
      console.log(`🚀 სერვერი გაშვებულია პორტზე ${port}`);
    });
  } catch (error) {
    console.error('სერვერის გაშვების შეცდომა:', error);
    process.exit(1);
  }
};

startServer(); 