import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { Document, DocumentSchema } from './schemas/document.schema';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { Request } from 'express';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Document.name, schema: DocumentSchema }]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (_: any, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          cb(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
        }
      }),
      fileFilter: (_: Request, file: Express.Multer.File, cb: (error: Error | null, acceptFile: boolean) => void) => {
        if (!file.originalname.match(/\.(pdf|doc|docx)$/)) {
          return cb(new Error('მხოლოდ PDF და Word დოკუმენტებია დაშვებული!'), false);
        }
        cb(null, true);
      }
    }),
    SubscriptionsModule,
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService],
  exports: [DocumentsService],
})
export class DocumentsModule {} 