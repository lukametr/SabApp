import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Controller('health')
export class HealthController {
  constructor(@InjectConnection() private readonly mongoConnection: Connection) {}

  @Get()
  async check() {
    const isMongoConnected = this.mongoConnection.readyState === 1;
    
    if (!isMongoConnected) {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: 'MongoDB connection failed',
        environment: process.env.NODE_ENV || 'development',
      };
    }

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: 'connected',
    };
  }

  @Get('debug')
  async debug() {
    const isMongoConnected = this.mongoConnection.readyState === 1;
    
    return {
      status: isMongoConnected ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      port: process.env.PORT,
      corsOrigin: process.env.CORS_ORIGIN,
      frontendUrl: process.env.FRONTEND_URL,
      hasMongoUri: !!process.env.MONGODB_URI,
      mongoConnected: isMongoConnected,
      hasGoogleClientId: !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      googleClientIdLength: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.length || 0,
      mongoDbUri: process.env.MONGODB_URI?.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'),
    };
  }
}
