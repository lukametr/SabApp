import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { SpaController } from './spa.controller';
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
        const mongoUri = configService.get<string>('MONGODB_URI') || 'mongodb://localhost:27017/sabapp';
        
        // უსაფრთხო ლოგირება
        const maskedUri = mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//<credentials>@');
        console.log('🔧 MongoDB - კავშირდება:', maskedUri);
        
        return {
          uri: mongoUri,
          retryWrites: true,
          w: 'majority',
          maxPoolSize: 10,
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
        };
      },
      inject: [ConfigService],
    }),
    // Serve the prebuilt frontend from /public (populated in Dockerfile)
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api*', '/health*', '/docs*'],
    }),
    DocumentsModule,
    AuthModule,
    UsersModule,
    HealthModule,
    DebugModule,
    SubscriptionModule,
  ],
  controllers: [AppController, SpaController],
  providers: [],
})
export class AppModule {
  constructor() {
    console.log('✅ AppModule ინიციალიზებულია');
  }
}
