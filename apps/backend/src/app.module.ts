import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { DocumentsModule } from './documents/documents.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { HealthModule } from './health.module';
import { DebugModule } from './debug/debug.module';
import { SubscriptionModule } from './subscription/subscription.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    ScheduleModule.forRoot(), // For cron jobs
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const mongoUri = configService.get<string>('MONGODB_URI') || 'mongodb://localhost:27017/sabap';
        console.log('🔧 MongoDB - Connecting to:', mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//<credentials>@'));
        
        return {
          uri: mongoUri,
          retryWrites: true,
          w: 'majority',
          maxPoolSize: 10,
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
          // Enhanced retry options
          retryAttempts: 5,
          retryDelay: 3000,
          // Connection event handlers for debugging
          connectionFactory: (connection: any) => {
            connection.on('connected', () => {
              console.log('✅ MongoDB connected successfully');
            });
            connection.on('error', (error: any) => {
              console.error('❌ MongoDB connection error:', error);
            });
            connection.on('disconnected', () => {
              console.warn('⚠️ MongoDB disconnected');
            });
            connection.on('reconnected', () => {
              console.log('🔄 MongoDB reconnected');
            });
            return connection;
          },
        };
      },
      inject: [ConfigService],
    }),
    DocumentsModule,
    AuthModule,
    UsersModule,
    HealthModule,
    DebugModule,
    SubscriptionModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
