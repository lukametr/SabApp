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
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/sabap',
      {
        autoCreate: true,
        retryAttempts: 0,  // Don't retry on startup
        retryDelay: 1000,
        connectionFactory: (connection) => {
          connection.on('connected', () => {
            console.log('✅ MongoDB connection established');
          });
          connection.on('disconnected', () => {
            console.log('❌ MongoDB connection lost');
          });
          connection.on('error', (err: Error) => {
            console.error('MongoDB connection error:', err);
          });
          return connection;
        }
      }
    ),
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
