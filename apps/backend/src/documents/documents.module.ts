import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { ReportService } from './report.service';
import { Document, DocumentSchema } from './schemas/document.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Document.name, schema: DocumentSchema }])
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService, ReportService],
  exports: [DocumentsService, ReportService]
})
export class DocumentsModule {} 