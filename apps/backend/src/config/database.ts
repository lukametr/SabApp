import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/saba';

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB დაკავშირებულია წარმატებით');
  } catch (error) {
    console.error('MongoDB დაკავშირების შეცდომა:', error);
    process.exit(1);
  }
}; 