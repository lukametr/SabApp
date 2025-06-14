export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  database: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/saba',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: '24h',
  },
  subscription: {
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    priceId: process.env.STRIPE_PRICE_ID,
  },
  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:3000',
  },
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ],
  },
}); 