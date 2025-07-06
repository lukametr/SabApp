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
        serverSelectionTimeoutMS: 5000,
        retryWrites: true,
        retryReads: true,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        ssl: true,
        authSource: 'admin',
        connectionFactory: (connection) => {
          connection.on('connected', () => {
            console.log('✅ MongoDB is connected');
            console.log('📊 Connection details:', {
              host: connection.host,
              port: connection.port,
              name: connection.name,
            });
          });
          connection.on('disconnected', () => {
            console.log('❌ MongoDB is disconnected');
          });
          connection.on('error', (error: Error) => {
            console.error('❌ MongoDB connection error:', error);
          });
          return connection;
        },
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
