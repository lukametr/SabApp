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
app.use(cors());
app.use(express.json());

// მონაცემთა ბაზასთან დაკავშირება
connectMongo().then(() => {
  console.log('მონაცემთა ბაზასთან დაკავშირება წარმატებულია');
}).catch((error) => {
  console.error('მონაცემთა ბაზასთან დაკავშირების შეცდომა:', error);
  process.exit(1);
});

// მარშრუტები
app.use('/api', documentRoutes);
app.use('/api', healthRoutes);

// სერვერის გაშვება
app.listen(port, () => {
  console.log(`🚀 სერვერი გაშვებულია პორტზე ${port}`);
}); 