import { Controller, Get, Post, Body, Param, Delete, UseInterceptors, UploadedFiles, Patch, Res, UseGuards, Request } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { DocumentsService } from './documents.service';
import { ReportService } from './report.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { existsSync } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import { OptionalAuthGuard, JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('documents')
export class DocumentsController {
  constructor(
    private readonly documentsService: DocumentsService,
    private readonly reportService: ReportService
  ) {}

  @Post()
  @UseGuards(OptionalAuthGuard)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'photos', maxCount: 10 },
    { name: 'hazardPhotos', maxCount: 50 }
  ]))
  async create(@Body() createDocumentDto: CreateDocumentDto, @UploadedFiles() files: any, @Request() req: any) {
    try {
      const userId = req.user?.id || req.user?.sub; // Get user ID from JWT token
      console.log('📋 Creating document for user:', userId || 'anonymous');
      console.log('📋 Received document data:', createDocumentDto);
      console.log('📸 Received files:', files);
      
      // Validate required fields
      if (!createDocumentDto.evaluatorName || !createDocumentDto.evaluatorLastName || 
          !createDocumentDto.objectName || !createDocumentDto.workDescription) {
        throw new Error('Required fields are missing');
      }
      
      // Validate dates
      if (!createDocumentDto.date || !createDocumentDto.time) {
        throw new Error('Date and time are required');
      }
    
    // Parse hazards from string if it's a string
    let hazards = [];
    if (createDocumentDto.hazards) {
      if (typeof createDocumentDto.hazards === 'string') {
        try {
          hazards = JSON.parse(createDocumentDto.hazards);
          console.log('📋 Parsed hazards from string:', hazards.length);
          console.log('📋 First hazard structure:', JSON.stringify(hazards[0], null, 2));
        } catch (error) {
          console.error('❌ Error parsing hazards:', error);
          hazards = [];
        }
      } else {
        hazards = createDocumentDto.hazards;
        console.log('📋 Received hazards as array:', hazards.length);
      }
    }
    
    // Convert files to base64 and store in database
    const savedPhotos: string[] = [];
    const savedHazardPhotos: string[] = [];
    
    if (files && files.photos) {
      console.log('📸 Processing', files.photos.length, 'document photos');
      for (const file of files.photos) {
        const base64Data = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        savedPhotos.push(base64Data);
      }
    }
    
    if (files && files.hazardPhotos) {
      console.log('📸 Processing', files.hazardPhotos.length, 'hazard photos');
      for (const file of files.hazardPhotos) {
        const base64Data = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        savedHazardPhotos.push(base64Data);
      }
    }
    
    // Add base64 photos to hazards in order
    if (hazards.length > 0) {
      let photoIndex = 0;
      hazards = hazards.map((hazard: any, hazardIndex: number) => {
        const hazardWithPhotos = {
          ...hazard,
          id: hazard.id || `hazard_${Date.now()}_${hazardIndex}`, // Ensure unique ID
          photos: [] as string[]
        };
        
        // Add one photo per hazard if available
        if (photoIndex < savedHazardPhotos.length) {
          hazardWithPhotos.photos.push(savedHazardPhotos[photoIndex]);
          console.log('📸 Added photo to hazard:', hazardWithPhotos.id, 'at index', photoIndex);
          photoIndex++;
        }
        
        return hazardWithPhotos;
      });
    }
    
    // Create document with base64 photos stored in database
    const documentWithPhotos = {
      ...createDocumentDto,
      hazards,
      photos: savedPhotos
    };
    
    console.log('✅ Final document data with base64 photos:', {
      hazardsCount: hazards.length,
      photosCount: savedPhotos.length,
      hazardPhotosCount: savedHazardPhotos.length,
      hazardWithPhotos: hazards.map((h: any) => ({
        id: h.id,
        photosCount: h.photos?.length || 0
      }))
    });
    
    return this.documentsService.create(documentWithPhotos, userId);
    } catch (error) {
      console.error('❌ Error creating document:', error);
      throw error;
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Request() req: any) {
    const userId = req.user?.id || req.user?.sub; // Get user ID from JWT token
    if (!userId) {
      throw new Error('User authentication required');
    }
    console.log('📋 Fetching documents for user:', userId);
    return this.documentsService.findAll(userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @Request() req: any) {
    const userId = req.user?.id || req.user?.sub; // Get user ID from JWT token
    if (!userId) {
      throw new Error('User authentication required');
    }
    console.log('📋 Fetching document:', id, 'for user:', userId);
    return this.documentsService.findOne(id, userId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'photos', maxCount: 10 },
    { name: 'hazardPhotos', maxCount: 50 }
  ]))
  async update(@Param('id') id: string, @Body() updateDocumentDto: UpdateDocumentDto, @UploadedFiles() files: any, @Request() req: any) {
    try {
      const userId = req.user?.id || req.user?.sub; // Get user ID from JWT token
      if (!userId) {
        throw new Error('User authentication required');
      }
      console.log('📋 Updating document:', id, 'for user:', userId);
      console.log('📋 Update data:', updateDocumentDto);
      console.log('📸 Received files for update:', files);
      
      // Validate ID
      if (!id || id.trim() === '') {
        throw new Error('Document ID is required');
      }
    
    // Parse hazards from string if it's a string
    let hazards = [];
    if (updateDocumentDto.hazards) {
      if (typeof updateDocumentDto.hazards === 'string') {
        try {
          hazards = JSON.parse(updateDocumentDto.hazards as any);
          console.log('📋 Parsed hazards from string:', hazards.length);
        } catch (error) {
          console.error('❌ Error parsing hazards:', error);
          hazards = [];
        }
      } else {
        hazards = updateDocumentDto.hazards;
        console.log('📋 Received hazards as array:', hazards.length);
      }
    }
    
    // Convert files to base64 and store in database
    const savedPhotos: string[] = [];
    const savedHazardPhotos: string[] = [];
    
    if (files && files.photos) {
      console.log('📸 Processing', files.photos.length, 'document photos');
      for (const file of files.photos) {
        const base64Data = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        savedPhotos.push(base64Data);
      }
    }
    
    if (files && files.hazardPhotos) {
      console.log('📸 Processing', files.hazardPhotos.length, 'hazard photos');
      for (const file of files.hazardPhotos) {
        const base64Data = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        savedHazardPhotos.push(base64Data);
      }
    }
    
    // Add base64 photos to hazards in order
    if (hazards.length > 0) {
      let photoIndex = 0;
      hazards = hazards.map((hazard: any, hazardIndex: number) => {
        const hazardWithPhotos = {
          ...hazard,
          id: hazard.id || `hazard_${Date.now()}_${hazardIndex}`, // Ensure unique ID
          photos: hazard.photos || [] as string[]
        };
        
        // Add one photo per hazard if available
        if (photoIndex < savedHazardPhotos.length) {
          hazardWithPhotos.photos.push(savedHazardPhotos[photoIndex]);
          console.log('📸 Added photo to hazard:', hazardWithPhotos.id, 'at index', photoIndex);
          photoIndex++;
        }
        
        return hazardWithPhotos;
      });
    }
    
    // Update document with base64 photos stored in database
    const documentWithPhotos = {
      ...updateDocumentDto,
      hazards,
      photos: savedPhotos.length > 0 ? savedPhotos : updateDocumentDto.photos
    };
    
    console.log('✅ Final update data with base64 photos:', {
      hazardsCount: hazards.length,
      photosCount: savedPhotos.length,
      hazardPhotosCount: savedHazardPhotos.length,
      hazardWithPhotos: hazards.map((h: any) => ({
        id: h.id,
        photosCount: h.photos?.length || 0
      }))
    });
    
    return this.documentsService.update(id, documentWithPhotos, userId);
    } catch (error) {
      console.error('❌ Error updating document:', error);
      throw error;
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() req: any) {
    const userId = req.user?.id || req.user?.sub; // Get user ID from JWT token
    if (!userId) {
      throw new Error('User authentication required');
    }
    console.log('🗑️ Deleting document:', id, 'for user:', userId);
    return this.documentsService.remove(id, userId);
  }

  @Post(':id/favorite')
  @UseGuards(JwtAuthGuard)
  toggleFavorite(@Param('id') id: string, @Request() req: any) {
    const userId = req.user?.id || req.user?.sub;
    if (!userId) {
      throw new Error('User authentication required');
    }
    return this.documentsService.toggleFavorite(id, userId);
  }

  @Patch(':id/assessment')
  @UseGuards(JwtAuthGuard)
  updateAssessment(
    @Param('id') id: string,
    @Body() body: { assessmentA: number; assessmentSh: number; assessmentR: number },
    @Request() req: any
  ) {
    const userId = req.user?.id || req.user?.sub;
    if (!userId) {
      throw new Error('User authentication required');
    }
    return this.documentsService.updateAssessment(
      id,
      body.assessmentA,
      body.assessmentSh,
      body.assessmentR,
      userId
    );
  }

  @Get(':id/download')
  @UseGuards(JwtAuthGuard)
  async downloadDocument(@Param('id') id: string, @Res() res: Response, @Request() req: any): Promise<void> {
    console.log(`📥 Starting download for document: ${id}`);
    
    try {
      const userId = req.user?.id || req.user?.sub;
      if (!userId) {
        res.status(401).json({ message: 'User authentication required' });
        return;
      }
      
      // Get document info for filename
      const document = await this.documentsService.findOne(id, userId);
      if (!document) {
        res.status(404).json({ message: 'Document not found' });
        return;
      }

      const buffer = await this.documentsService.getDocumentFile(id);
      
      // Create descriptive filename
      const sanitizedName = document.objectName 
        ? document.objectName.replace(/[^a-zA-Z0-9\u10A0-\u10FF\s-]/g, '') // Allow Georgian characters
        : 'document';
      
      const filename = `${sanitizedName}_${document.evaluatorName || 'unknown'}_${new Date().toISOString().split('T')[0]}.zip`;
      
      console.log(`📦 Download filename: ${filename}`);
      console.log(`📊 File size: ${buffer.length} bytes`);
      
      res.set({
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
        'Content-Length': buffer.length.toString(),
      });
      
      res.send(buffer);
    } catch (error) {
      console.error('❌ Download error:', error);
      res.status(500).json({ message: 'Download failed', error: error.message });
    }
  }

  @Post('download')
  async downloadMultipleDocuments(@Body() body: { ids: string[] }, @Res() res: Response) {
    const buffer = await this.documentsService.getMultipleDocumentFiles(body.ids);
    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="documents.zip"',
    });
    res.send(buffer);
  }

  // Excel რეპორტის ჩამოტვირთვა
  @Get(':id/download/excel')
  @UseGuards(JwtAuthGuard)
  async downloadExcelReport(@Param('id') id: string, @Res() res: Response, @Request() req: any) {
    try {
      const userId = req.user?.id || req.user?.sub;
      if (!userId) {
        res.status(401).json({ message: 'User authentication required' });
        return;
      }
      
      const document = await this.documentsService.findOne(id, userId);
      const excelBuffer = await this.reportService.generateExcelReport(document);
      
      const fileName = `უსაფრთხოების-შეფასება-${document.objectName}-${new Date().toISOString().split('T')[0]}.xlsx`;
      
      res.set({
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(fileName)}"`,
      });
      res.send(excelBuffer);
      
      console.log(`📊 Excel რეპორტი გენერირდა დოკუმენტისთვის: ${id}`);
    } catch (error) {
      console.error('❌ Excel რეპორტის შეცდომა:', error);
      res.status(500).json({ message: 'Excel რეპორტის გენერაცია ვერ მოხერხდა', error: error.message });
    }
  }

  // PDF რეპორტის ჩამოტვირთვა
  @Get(':id/download/pdf')
  @UseGuards(JwtAuthGuard)
  async downloadPDFReport(@Param('id') id: string, @Res() res: Response, @Request() req: any) {
    try {
      const userId = req.user?.id || req.user?.sub;
      if (!userId) {
        res.status(401).json({ message: 'User authentication required' });
        return;
      }
      
      const document = await this.documentsService.findOne(id, userId);
      const pdfBuffer = await this.reportService.generatePDFReport(document);
      
      const fileName = `უსაფრთხოების-შეფასება-${document.objectName}-${new Date().toISOString().split('T')[0]}.pdf`;
      
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(fileName)}"`,
      });
      res.send(pdfBuffer);
      
      console.log(`📄 PDF რეპორტი გენერირდა დოკუმენტისთვის: ${id}`);
    } catch (error) {
      console.error('❌ PDF რეპორტის შეცდომა:', error);
      res.status(500).json({ message: 'PDF რეპორტის გენერაცია ვერ მოხერხდა', error: error.message });
    }
  }

  // PDF დიაგნოსტიკის ენდპოინტი
  @Get('diagnostics/pdf')
  async getPDFDiagnostics(@Res() res: Response) {
    try {
      const execAsync = promisify(exec);
      
      const possiblePaths = [
        process.env.PUPPETEER_EXECUTABLE_PATH,
        process.env.CHROME_BIN,
        '/usr/bin/chromium-browser',
        '/usr/bin/chromium',
        '/usr/bin/google-chrome-stable',
        '/usr/bin/google-chrome'
      ].filter(Boolean);
      
      const diagnostics = {
        environment: {
          NODE_ENV: process.env.NODE_ENV,
          PUPPETEER_EXECUTABLE_PATH: process.env.PUPPETEER_EXECUTABLE_PATH,
          CHROME_BIN: process.env.CHROME_BIN,
          platform: process.platform,
          arch: process.arch
        },
        possiblePaths,
        existingPaths: possiblePaths.filter(path => path && existsSync(path)),
        systemInfo: {}
      };
      
      try {
        const { stdout } = await execAsync('which chromium-browser || which chromium || which google-chrome');
        diagnostics.systemInfo = { chromiumLocation: stdout.trim() };
      } catch (error) {
        diagnostics.systemInfo = { error: 'Chromium not found in PATH' };
      }
      
      res.json(diagnostics);
    } catch (error) {
      console.error('❌ PDF დიაგნოსტიკის შეცდომა:', error);
      res.status(500).json({ message: 'დიაგნოსტიკის შეცდომა', error: error.message });
    }
  }

  // File serving endpoint removed - photos are now stored as base64 in database
}