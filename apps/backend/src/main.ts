import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    abortOnError: false,
  });

  // Set global prefix for all API routes
  app.setGlobalPrefix('api');

  // Security headers
  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://*.googleapis.com", "https://*.gstatic.com", "*.google.com", "https://*.ggpht.com", "*.googleusercontent.com", "https://accounts.google.com", "blob:"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        imgSrc: ["'self'", "data:", "https://*.googleapis.com", "https://*.gstatic.com", "*.google.com", "*.googleusercontent.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        connectSrc: ["'self'", "https://*.googleapis.com", "*.google.com", "https://*.gstatic.com", "data:", "blob:"],
        frameSrc: ["*.google.com"],
        workerSrc: ["blob:"],
      },
    },
  }));
  
  // Compression
  app.use(compression());

  // CORS კონფიგურაცია
  const corsOrigin = process.env.CORS_ORIGIN || '*';
  app.enableCors({
    origin: corsOrigin === '*' ? true : [corsOrigin, 'http://localhost:3000', 'http://localhost:3001', 'http://localhost:10000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: false,
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Methods',
      'Access-Control-Allow-Credentials'
    ],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 3600,
    preflightContinue: false,
    optionsSuccessStatus: 204
  });

  // Enable validation
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('SabApp API')
    .setDescription('The SabApp API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  try {
    const portEnv = process.env.PORT;
    if (!portEnv) {
      console.error('❌ PORT env var missing');
      process.exit(1);
    }

    const port = parseInt(portEnv, 10);
    if (isNaN(port)) {
      console.error('❌ Invalid PORT value:', portEnv);
      process.exit(1);
    }

    // Error handling
    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      // Don't exit on uncaught exceptions in production
      if (process.env.NODE_ENV !== 'production') {
        process.exit(1);
      }
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
      // Don't exit on unhandled rejections in production
      if (process.env.NODE_ENV !== 'production') {
        process.exit(1);
      }
    });

    // Keep-alive mechanism for Render
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully');
      app.close().then(() => {
        console.log('Application closed');
        process.exit(0);
      }).catch((error) => {
        console.error('Error during shutdown:', error);
        process.exit(1);
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT received, shutting down gracefully');
      app.close().then(() => {
        console.log('Application closed');
        process.exit(0);
      }).catch((error) => {
        console.error('Error during shutdown:', error);
        process.exit(1);
      });
    });

    // Start the application
    await app.listen(port, '0.0.0.0');
    console.log(`✅ Application is running on: http://0.0.0.0:${port}`);
    console.log(`📚 API Documentation available at: http://0.0.0.0:${port}/docs`);
    console.log(`🏥 Health check available at: http://0.0.0.0:${port}/api/health`);
    console.log(`🌐 CORS Origin: ${corsOrigin}`);
    
    // Keep the process alive - this is crucial for Render
    console.log('🚀 Application started successfully and keeping alive...');
    
    // Don't call process.stdin.resume() as it can cause issues
    // Instead, just keep the event loop running
    setInterval(() => {
      // Keep alive ping every 30 seconds
      console.log('💓 Keep-alive ping:', new Date().toISOString());
    }, 30000);
    
  } catch (error) {
    console.error('❌ Failed to start application:', error);
    process.exit(1);
  }
}

bootstrap().catch((error) => {
  console.error('❌ Bootstrap failed:', error);
  process.exit(1);
});
