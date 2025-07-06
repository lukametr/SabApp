import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import * as net from 'net';

@Controller('health')
export class HealthController {
  constructor(
    @InjectConnection() private readonly mongoConnection: Connection
  ) {}

  @Get()
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('db')
  async checkDb() {
    const isMongoConnected = this.mongoConnection.readyState === 1;
    const readyStateMap = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
      99: 'uninitialized'
    };
    
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: {
        state: readyStateMap[this.mongoConnection.readyState],
        connected: isMongoConnected,
        host: this.mongoConnection.host,
        port: this.mongoConnection.port,
        name: this.mongoConnection.name
      }
    };
  }

  @Get('debug')
  async debug() {
    const isMongoConnected = this.mongoConnection.readyState === 1;
    
    // Test direct connection to mongo ports
    const testPort = (host: string, port: number): Promise<boolean> => {
      return new Promise((resolve) => {
        const socket = new net.Socket();
        socket.setTimeout(5000);
        socket.on('connect', () => {
          socket.end();
          resolve(true);
        });
        socket.on('timeout', () => {
          socket.destroy();
          resolve(false);
        });
        socket.on('error', () => resolve(false));
        
        socket.connect(port, host);
      });
    };

    // Test MongoDB hosts
    const hosts = [
      'cluster0-shard-00-00.l56lnkq.mongodb.net',
      'cluster0-shard-00-01.l56lnkq.mongodb.net',
      'cluster0-shard-00-02.l56lnkq.mongodb.net'
    ];
    
    const portTests = await Promise.all(
      hosts.map(async (host) => ({
        host,
        canConnect: await testPort(host, 27017)
      }))
    );
    
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      database: {
        state: isMongoConnected ? 'connected' : 'disconnected',
        readyState: this.mongoConnection.readyState,
        hosts: portTests,
        uri: process.env.MONGODB_URI?.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')
      }
    };
  }
}
