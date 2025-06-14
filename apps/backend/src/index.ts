import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

import authRoutes from './routes/auth';
import documentRoutes from './routes/documents';
import healthRoutes from './routes/health';

// გარემოს ცვლადების ჩატვირთვა
dotenv.config();

const app = express();

// მონგო დაკავშირება
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/saba')
  .then(() => console.log('MongoDB დაკავშირებულია'))
  .catch(err => console.error('MongoDB დაკავშირების შეცდომა:', err));

// მიდლვეარები
app.use(cors());
app.use(express.json());

// შევქმნათ uploads დირექტორია თუ არ არსებობს
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// სტატიკური ფაილების მიწოდება
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// მარშრუტები
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api', healthRoutes);

// შეცდომების დამუშავება
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`სერვერი გაშვებულია პორტზე ${PORT}`);
}); 