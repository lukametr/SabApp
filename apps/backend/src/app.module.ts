import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DocumentsModule } from './documents/documents.module';
import { HealthModule } from './health.module';
import { VersionMetricsModule } from './version-metrics/version-metrics.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { DebugModule } from './debug/debug.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.production', '.env'],
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/sabapp'),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api*'],
    }),
    AuthModule,
    UsersModule,
    DocumentsModule,
    HealthModule,
    VersionMetricsModule,
    SubscriptionModule,
    DebugModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
