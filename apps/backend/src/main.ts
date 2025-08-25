import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException, RequestMethod } from '@nestjs/common';
import { json, urlencoded } from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';
import { UsersService } from './users/users.service';
import { UserRole } from './users/schemas/user.schema';

async function createDefaultAdmin(app: any) {
  try {
    console.log('👤 Creating default admin user...');
    const usersService = app.get(UsersService);
    
    // Check if admin already exists
    const existingAdmin = await usersService.findByEmail('admin@saba.com');
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      return;
    }

    // Create admin user
    const adminData = {
      name: 'Super Admin',
      email: 'admin@saba.com',
      password: 'admin123', // Will be hashed by createEmailUser
      personalNumber: '01234567891',
      organization: 'SabaApp',
      position: 'System Administrator'
    };

    const admin = await usersService.createEmailUser(adminData);
    
    // Update role to ADMIN after creation
    await usersService.updateUserRole(admin.id, UserRole.ADMIN);
    
    console.log('✅ Default admin user created successfully!');
    console.log('📧 Email: admin@saba.com');
    console.log('👑 Role: ADMIN');
    
  } catch (error) {
    console.error('❌ Error creating default admin user:', error.message);
    // Don't fail startup if admin creation fails
  }
}

async function bootstrap() {
  console.log('🚀 Bootstrap starting...');
  console.log('� CWD:', process.cwd());
  console.log('�🔧 Environment variables:', {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI ? 'SET' : 'MISSING'
  });
  
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    abortOnError: false,
  });

  console.log('✅ NestJS application created successfully');

  // Increase request body size limits to support base64 images
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));

  // Set global prefix for all API routes, but keep /health and /docs at root
  app.setGlobalPrefix('api', {
    exclude: [
      { path: 'health', method: RequestMethod.ALL },
      { path: 'docs', method: RequestMethod.ALL },
    ],
  });

  // Request logging middleware
  app.use((req: any, _res: any, next: any) => {
    if (req.method === 'PATCH' || req.method === 'POST') {
      console.log(`🔍 ${req.method} ${req.url}`, {
        contentType: req.headers['content-type'],
        bodySize: req.body ? Object.keys(req.body).length : 0,
        params: req.params,
        query: req.query
      });
    }
    next();
  });

  // Debug middleware და SPA fallback ამოღებულია, რადგან ServeStaticModule სწორად ემსახურება static ფაილებს და არ იჭერს API როუტებს

  // Production logging
  if (process.env.NODE_ENV === 'production') {
    app.use((req: any, res: any, next: any) => {
      const start = Date.now();
      res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
      });
      next();
    });
  }

  // Security headers
  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://*.googleapis.com", "https://*.gstatic.com", "*.google.com", "https://*.ggpht.com", "*.googleusercontent.com", "https://accounts.google.com", "blob:"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://accounts.google.com", "https://*.gstatic.com"],
        styleSrcElem: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://accounts.google.com", "https://*.gstatic.com"],
        imgSrc: ["'self'", "data:", "https://*.googleapis.com", "https://*.gstatic.com", "*.google.com", "*.googleusercontent.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        connectSrc: ["'self'", "https://*.googleapis.com", "*.google.com", "https://*.gstatic.com", "data:", "blob:"],
        frameSrc: ["*.google.com", "https://accounts.google.com"],
        workerSrc: ["blob:"],
      },
    },
  }));
  
  // Compression
  app.use(compression());

  // CORS კონფიგურაცია
  const corsOrigin = process.env.CORS_ORIGIN || '*';
  const allowedOrigins = corsOrigin === '*' 
    ? true 
    : corsOrigin.split(',').concat([
        'http://localhost:3000', 
        'http://localhost:3001', 
        'http://localhost:3002', 
        'http://localhost:10000'
      ]);
  
  app.enableCors({
    origin: allowedOrigins,
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
    exposedHeaders: ['R-Range', 'X-Content-Range'],
    maxAge: 3600,
    preflightContinue: false,
    optionsSuccessStatus: 204
  });

  // Enable validation
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: false, // Allow non-whitelisted properties for FormData
    skipMissingProperties: false, // Don't skip validation for missing properties
    validationError: { target: false, value: false },
    exceptionFactory: (errors) => {
      const simplified = errors.map(error => ({
        property: error.property,
        value: error.value,
        constraints: error.constraints
      }));
      console.error('📋 Validation errors:', simplified);
      return new BadRequestException({
        message: 'Validation failed',
        errors: simplified,
      });
    }
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
      console.warn('⚠️  PORT env var missing, defaulting to 3001');
    }
    const port = parseInt(portEnv || '3001', 10);
    if (isNaN(port)) {
      console.warn('⚠️  Invalid PORT value, defaulting to 3001:', portEnv);
    }

    // Test MongoDB connection before starting server
    console.log('🔍 Testing MongoDB connection...');
    try {
      const mongoose = require('mongoose');
      const mongoUri = process.env.MONGODB_URI;
      if (!mongoUri) {
        throw new Error('MONGODB_URI environment variable is missing');
      }
      console.log('🔗 Attempting to connect to MongoDB...');
      await mongoose.connect(mongoUri, { 
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000 
      });
      console.log('✅ MongoDB connection test successful');
      await mongoose.disconnect();
    } catch (mongoError) {
      console.error('❌ MongoDB connection test failed:', mongoError.message);
      console.log('🚑 Starting without MongoDB dependency for healthcheck...');
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
    console.log(`🚀 Starting application on port ${port}...`);
    await app.listen(port, '0.0.0.0');
    console.log(`✅ Application is running on: http://0.0.0.0:${port}`);
    
    // Test health endpoint immediately
    console.log(`🏥 Testing health endpoint immediately...`);
    try {
      const healthResponse = await fetch(`http://localhost:${port}/health`);
      console.log(`🏥 Health endpoint test: ${healthResponse.status} - ${await healthResponse.text()}`);
    } catch (healthError) {
      console.error(`🏥 Health endpoint test failed:`, healthError.message);
    }
    
    // Create default admin user after app starts
    await createDefaultAdmin(app);
    console.log(`📚 API Documentation available at: http://0.0.0.0:${port}/docs`);
    console.log(`🏥 Health check available at: http://0.0.0.0:${port}/health`);
    console.log(`🌐 CORS Origin: ${corsOrigin}`);
    console.log(`🔧 API Routes available at: http://0.0.0.0:${port}/api`);
    
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
