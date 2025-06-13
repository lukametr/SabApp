import mongoose from 'mongoose';

const connectMongo = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI არ არის განსაზღვრული');
    }

    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB Atlas-ზე წარმატებით დავუკავშირდით');
  } catch (error) {
    console.error('❌ შეცდომა MongoDB Atlas-თან კავშირში:', error);
    process.exit(1);
  }
};

export default connectMongo; 