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
        const directUri = 'mongodb://lukametr:akukelaAIO12@ac-wbztgnk-shard-00-00.l56lnkq.mongodb.net:27017,ac-wbztgnk-shard-00-01.l56lnkq.mongodb.net:27017,ac-wbztgnk-shard-00-02.l56lnkq.mongodb.net:27017/saba?ssl=true&authSource=admin';
        
        console.log('📡 Connecting to MongoDB using direct connection...');
        
        return {
          uri: directUri,
          retryAttempts: 1,
          ssl: true,
          authSource: 'admin',
          directConnection: true
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
