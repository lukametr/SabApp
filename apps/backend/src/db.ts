import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error('MONGO_URI გარემოს ცვლადი არ არის განსაზღვრული');
}

export const connectMongo = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB-სთან დაკავშირება წარმატებულია');
  } catch (error) {
    console.error('MongoDB-სთან დაკავშირების შეცდომა:', error);
    throw error;
  }
}; 