import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { promisify } from 'util';
import * as dns from 'dns';

const lookup = promisify(dns.lookup);
const resolveSrv = promisify(dns.resolveSrv);

@Controller('health')
export class HealthController {
  constructor(@InjectConnection() private readonly mongoConnection: Connection) {}

  @Get()
  check() {
    // Always return OK to pass Railway's healthcheck
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    };
  }

  @Get('db')
  async checkDb() {
    const isMongoConnected = this.mongoConnection.readyState === 1;
    
    return {
      status: isMongoConnected ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: isMongoConnected ? 'connected' : 'disconnected',
    };
  }

  @Get('debug')
  async debug() {
    const isMongoConnected = this.mongoConnection.readyState === 1;
    
    // Check DNS resolution
    let dnsStatus = 'unknown';
    try {
      await lookup('cluster0.l56lnkq.mongodb.net');
      dnsStatus = 'ok';
    } catch (error) {
      dnsStatus = `error: ${error.code}`;
    }

    // Try SRV record
    let srvStatus = 'unknown';
    try {
      await resolveSrv('_mongodb._tcp.cluster0.mongodb.net');
      srvStatus = 'ok';
    } catch (error) {
      srvStatus = `error: ${error.code}`;
    }
    
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      port: process.env.PORT,
      corsOrigin: process.env.CORS_ORIGIN,
      hasMongoUri: !!process.env.MONGODB_URI,
      mongoConnected: isMongoConnected,
      mongoReadyState: this.mongoConnection.readyState,
      dnsResolution: dnsStatus,
      srvResolution: srvStatus,
      hasGoogleClientId: !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      googleClientIdLength: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.length || 0,
      // Hide sensitive info but show format for debugging
      mongoDbUri: process.env.MONGODB_URI?.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'),
    };
  }
}
