import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { DocumentsModule } from './documents/documents.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/sabap'),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', '..', 'apps', 'frontend', 'out'),
      exclude: ['/api*'],
      serveRoot: '/',
      serveStaticOptions: {
        index: false,
        redirect: false,
      },
    }),
    DocumentsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
