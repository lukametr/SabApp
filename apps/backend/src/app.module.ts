import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { DocumentsModule } from './documents/documents.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { HealthModule } from './health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => {
        // Replace mongodb+srv URL with direct connection URLs
        const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sabap';
        const directUri = uri
          .replace('mongodb+srv://', 'mongodb://')
          .replace('cluster0.mongodb.net', 'cluster0-shard-00-00.l56lnkq.mongodb.net:27017,cluster0-shard-00-01.l56lnkq.mongodb.net:27017,cluster0-shard-00-02.l56lnkq.mongodb.net:27017')
          + '&ssl=true&replicaSet=atlas-i0dhnx-shard-0&authSource=admin';

        console.log('📡 Connecting to MongoDB using:', directUri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'));
        
        return {
          uri: directUri,
          autoCreate: true,
          retryAttempts: 3,
          retryDelay: 1000,
          connectTimeoutMS: 10000,
          socketTimeoutMS: 45000,
          ssl: true,
          directConnection: false,
        };
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), '../frontend/.next'),
      exclude: ['/api/*', '/health*', '/docs*'],
      serveRoot: '/',
      serveStaticOptions: {
        index: 'index.html',
        fallthrough: true,
      },
    }),
    DocumentsModule,
    AuthModule,
    UsersModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
