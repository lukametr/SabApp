import { Controller, Get, Post, Body, Param, Delete, UseInterceptors, UploadedFiles, Patch, Res } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import * as fs from 'fs';
import * as path from 'path';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'photos', maxCount: 10 },
    { name: 'hazardPhotos', maxCount: 50 }
  ]))
  async create(@Body() createDocumentDto: CreateDocumentDto, @UploadedFiles() files: any) {
    console.log('✅ Received document data:', createDocumentDto);
    console.log('✅ Received files:', files);
    
    // Parse hazards from string if it's a string
    let hazards = [];
    if (createDocumentDto.hazards) {
      if (typeof createDocumentDto.hazards === 'string') {
        try {
          hazards = JSON.parse(createDocumentDto.hazards);
        } catch (error) {
          console.error('❌ Error parsing hazards:', error);
          hazards = [];
        }
      } else {
        hazards = createDocumentDto.hazards;
      }
    }
    
    // შევინახოთ ფაილები
    const savedPhotos: string[] = [];
    const savedHazardPhotos: string[] = [];
    
    if (files && files.photos) {
      const uploadsDir = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      
      for (const file of files.photos) {
        const fileName = `${Date.now()}-${file.originalname}`;
        const filePath = path.join(uploadsDir, fileName);
        
        // გადავიტანოთ ფაილი uploads დირექტორიაში
        fs.writeFileSync(filePath, file.buffer);
        savedPhotos.push(fileName);
      }
    }
    
    if (files && files.hazardPhotos) {
      const uploadsDir = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      
      for (const file of files.hazardPhotos) {
        const fileName = `${Date.now()}-${file.originalname}`;
        const filePath = path.join(uploadsDir, fileName);
        
        // გადავიტანოთ ფაილი uploads დირექტორიაში
        fs.writeFileSync(filePath, file.buffer);
        savedHazardPhotos.push(fileName);
      }
    }
    
    // დავამატოთ შენახული ფოტოების სახელები hazards-ებში
    if (hazards.length > 0 && savedHazardPhotos.length > 0) {
      hazards = hazards.map((hazard: any, index: number) => ({
        ...hazard,
        photos: savedHazardPhotos[index] ? [savedHazardPhotos[index]] : []
      }));
    }
    
    // დავამატოთ შენახული ფოტოების სახელები დოკუმენტში
    const documentWithPhotos = {
      ...createDocumentDto,
      hazards,
      photos: savedPhotos
    };
    
    console.log('✅ Final document data:', documentWithPhotos);
    
    return this.documentsService.create(documentWithPhotos);
  }

  @Get()
  findAll() {
    return this.documentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDocumentDto: UpdateDocumentDto) {
    return this.documentsService.update(id, updateDocumentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.documentsService.remove(id);
  }

  @Post(':id/favorite')
  toggleFavorite(@Param('id') id: string) {
    return this.documentsService.toggleFavorite(id);
  }

  @Patch(':id/assessment')
  updateAssessment(
    @Param('id') id: string,
    @Body() body: { assessmentA: number; assessmentSh: number; assessmentR: number }
  ) {
    return this.documentsService.updateAssessment(
      id,
      body.assessmentA,
      body.assessmentSh,
      body.assessmentR
    );
  }

  @Get(':id/download')
  async downloadDocument(@Param('id') id: string, @Res() res: Response) {
    const buffer = await this.documentsService.getDocumentFile(id);
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="document-${id}.zip"`,
    });
    res.send(buffer);
  }

  @Post('download')
  async downloadMultipleDocuments(@Body() body: { ids: string[] }, @Res() res: Response) {
    const buffer = await this.documentsService.getMultipleDocumentFiles(body.ids);
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': 'attachment; filename="documents.zip"',
    });
    res.send(buffer);
  }

  @Get('files/:filename')
  async serveFile(@Param('filename') filename: string, @Res() res: Response): Promise<void> {
    try {
      const filePath = path.join(process.cwd(), 'uploads', filename);
      
      if (!fs.existsSync(filePath)) {
        res.status(404).json({ message: 'ფაილი ვერ მოიძებნა' });
        return;
      }
      
      // Set appropriate headers
      const ext = path.extname(filename).toLowerCase();
      const mimeTypes: { [key: string]: string } = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.pdf': 'application/pdf',
      };
      
      const mimeType = mimeTypes[ext] || 'application/octet-stream';
      res.setHeader('Content-Type', mimeType);
      res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year cache
      
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } catch (error) {
      console.error('File serving error:', error);
      res.status(500).json({ message: 'ფაილის ჩატვირთვის შეცდომა' });
    }
  }
}