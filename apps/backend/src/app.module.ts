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
import { DebugModule } from './debug/debug.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: () => {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sabap';
        console.log('🔧 MongoDB - Connecting to:', mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//<credentials>@'));
        
        return {
          uri: mongoUri,
          retryWrites: true,
          w: 'majority',
          maxPoolSize: 10,
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
        };
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api/(.*)', '/health', '/docs'],
    }),
    DocumentsModule,
    AuthModule,
    UsersModule,
    HealthModule,
    DebugModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
