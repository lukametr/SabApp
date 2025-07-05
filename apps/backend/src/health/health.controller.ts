import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    };
  }

  @Get('debug')
  debug() {
    return {
      status: 'debug',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      port: process.env.PORT,
      corsOrigin: process.env.CORS_ORIGIN,
      frontendUrl: process.env.FRONTEND_URL,
      hasMongoUri: !!process.env.MONGODB_URI,
      hasGoogleClientId: !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      googleClientIdLength:
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.length || 0,
    };
  }
}
