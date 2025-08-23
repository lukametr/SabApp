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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SubscriptionGuard } from '../auth/guards/subscription.guard';

@Controller('documents')
export class DocumentsController {
  constructor(
    private readonly documentsService: DocumentsService,
    private readonly reportService: ReportService
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, SubscriptionGuard)
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
    
    // Add base64 photos to hazards in order - photos are already base64 in JSON
    if (hazards.length > 0) {
      let photoIndex = 0;
      hazards = hazards.map((hazard: any, hazardIndex: number) => {
        const hazardWithPhotos = {
          ...hazard,
          id: hazard.id || `hazard_${Date.now()}_${hazardIndex}`, // Ensure unique ID
          photos: hazard.photos || [] // Photos are already base64 from frontend
        };
        
        // Legacy: Add uploaded files to existing photos (if any file uploads)
        if (photoIndex < savedHazardPhotos.length) {
          hazardWithPhotos.photos.push(savedHazardPhotos[photoIndex]);
          console.log('📸 Added uploaded file to hazard:', hazardWithPhotos.id, 'at index', photoIndex);
          photoIndex++;
        }
        
        console.log('✅ Final hazard with photos:', {
          id: hazardWithPhotos.id,
          hazardIdentification: hazardWithPhotos.hazardIdentification || 'EMPTY',
          photosCount: hazardWithPhotos.photos?.length || 0,
          hasAllFields: !!(hazardWithPhotos.hazardIdentification && 
                           hazardWithPhotos.affectedPersons && 
                           hazardWithPhotos.injuryDescription)
        });
        
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
  @UseGuards(JwtAuthGuard, SubscriptionGuard)
  findAll(@Request() req: any) {
    const userId = req.user?.id || req.user?.sub; // Get user ID from JWT token
    console.log('📋 Fetching documents for user:', userId || 'all users');
    return this.documentsService.findAll(userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, SubscriptionGuard)
  findOne(@Param('id') id: string, @Request() req: any) {
    const userId = req.user?.id || req.user?.sub; // Get user ID from JWT token
    console.log('📋 Fetching document:', id, 'for user:', userId || 'anonymous');
    return this.documentsService.findOne(id, userId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, SubscriptionGuard)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'photos', maxCount: 10 },
    { name: 'hazardPhotos', maxCount: 50 }
  ]))
  async update(@Param('id') id: string, @Body() updateDocumentDto: UpdateDocumentDto, @UploadedFiles() files: any, @Request() req: any) {
    try {
      const userId = req.user?.id || req.user?.sub; // Get user ID from JWT token
      console.log('📋 Updating document:', id, 'for user:', userId || 'anonymous');
      console.log('📋 Update data:', updateDocumentDto);
      console.log('📸 Received files for update:', files);
      
      // Validate ID
      if (!id || id.trim() === '') {
        throw new Error('Document ID is required');
      }
    
    // Parse hazards only if provided; never default to empty (prevents accidental wipe)
    let hazards: any[] | undefined = undefined;
    const hazardsProvided = (updateDocumentDto as any).hazards !== undefined;
    if (hazardsProvided) {
      let parsed: any[] = [];
      if (typeof updateDocumentDto.hazards === 'string') {
        try {
          parsed = JSON.parse(updateDocumentDto.hazards as any);
          console.log('📋 Parsed hazards from string:', parsed.length);
        } catch (error) {
          console.error('❌ Error parsing hazards:', error);
          parsed = [];
        }
      } else {
        parsed = updateDocumentDto.hazards as any[];
        console.log('📋 Received hazards as array:', parsed.length);
      }
      hazards = parsed;
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
    
    // Add base64 photos to hazards in order - photos are already base64 in JSON
    if (Array.isArray(hazards) && hazards.length > 0) {
      let photoIndex = 0;
      hazards = hazards.map((hazard: any, hazardIndex: number) => {
        const hazardWithPhotos = {
          ...hazard,
          id: hazard.id || `hazard_${Date.now()}_${hazardIndex}`, // Ensure unique ID
          photos: hazard.photos || [] as string[]
        };
        
        // Legacy: Add one photo per hazard if available (if any file uploads)
        if (photoIndex < savedHazardPhotos.length) {
          hazardWithPhotos.photos.push(savedHazardPhotos[photoIndex]);
          console.log('📸 Added photo to hazard:', hazardWithPhotos.id, 'at index', photoIndex);
          photoIndex++;
        }
        
        console.log('✅ Final updated hazard with photos:', {
          id: hazardWithPhotos.id,
          hazardIdentification: hazardWithPhotos.hazardIdentification || 'EMPTY',
          photosCount: hazardWithPhotos.photos?.length || 0,
          hasAllFields: !!(hazardWithPhotos.hazardIdentification && 
                           hazardWithPhotos.affectedPersons && 
                           hazardWithPhotos.injuryDescription)
        });
        
        return hazardWithPhotos;
      });
    }

    // Build update payload safely (omit undefineds, include only present fields)
    const documentUpdate: any = { ...updateDocumentDto };
    // Hazards: include only if provided; otherwise do NOT touch existing hazards
    if (hazardsProvided) {
      documentUpdate.hazards = hazards || [];
    } else {
      delete documentUpdate.hazards;
    }
    // Photos: prefer newly uploaded; else include provided if defined; else omit
    if (savedPhotos.length > 0) {
      documentUpdate.photos = savedPhotos;
    } else if ((updateDocumentDto as any).photos === undefined) {
      delete documentUpdate.photos;
    }

    // Omit undefined fields to avoid unsetting existing values
    Object.keys(documentUpdate).forEach((k) => {
      if (documentUpdate[k] === undefined) {
        delete documentUpdate[k];
      }
    });

    // Log summary for diagnostics
    console.log('✅ Final update payload summary:', {
      includeHazards: hazardsProvided,
      hazardsCount: Array.isArray(documentUpdate.hazards) ? documentUpdate.hazards.length : 'UNCHANGED',
      photosProvided: (updateDocumentDto as any).photos !== undefined,
      uploadedPhotos: savedPhotos.length,
      hazardUploadedPhotos: savedHazardPhotos.length,
    });

    return this.documentsService.update(id, documentUpdate, userId);
    } catch (error) {
      console.error('❌ Error updating document:', error);
      throw error;
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, SubscriptionGuard)
  remove(@Param('id') id: string, @Request() req: any) {
    const userId = req.user?.id || req.user?.sub; // Get user ID from JWT token
    console.log('🗑️ Deleting document:', id, 'for user:', userId || 'anonymous');
    return this.documentsService.remove(id, userId);
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
  async downloadDocument(@Param('id') id: string, @Res() res: Response): Promise<void> {
    console.log(`📥 Starting download for document: ${id}`);
    
    try {
      // Get document info for filename
      const document = await this.documentsService.findOne(id);
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
  async downloadExcelReport(@Param('id') id: string, @Res() res: Response, @Request() req: any) {
    try {
      const document = await this.documentsService.findOne(id);
      
      // მომხმარებლის ინფორმაციის მიღება
      const userInfo = req.user ? {
        name: req.user.name || '',
        email: req.user.email || '',
        organization: req.user.organization || '',
        position: req.user.position || '',
        phoneNumber: req.user.phoneNumber || ''
      } : {};
      
      // დოკუმენტს ვუმატებთ user ინფორმაციას
      const documentWithUserInfo = {
        ...document,
        userInfo
      };
      
      const excelBuffer = await this.reportService.generateExcelReport(documentWithUserInfo);
      
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
  async downloadPDFReport(@Param('id') id: string, @Res() res: Response) {
    try {
      const document = await this.documentsService.findOne(id);
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
        '/usr/bin/google-chrome-stable',
        '/usr/bin/google-chrome',
        '/usr/bin/chromium-browser',
        '/usr/bin/chromium',
        '/opt/render/project/src/.chrome/chrome',
        '/app/.apt/usr/bin/google-chrome-stable'
      ].filter(Boolean);
      
      const diagnostics: any = {
        timestamp: new Date().toISOString(),
        environment: {
          NODE_ENV: process.env.NODE_ENV,
          RAILWAY_ENVIRONMENT: process.env.RAILWAY_ENVIRONMENT,
          RAILWAY_PROJECT_ID: process.env.RAILWAY_PROJECT_ID,
          PUPPETEER_EXECUTABLE_PATH: process.env.PUPPETEER_EXECUTABLE_PATH,
          CHROME_BIN: process.env.CHROME_BIN,
          platform: process.platform,
          arch: process.arch,
          nodeVersion: process.version,
          memory: process.memoryUsage()
        },
        possiblePaths,
        existingPaths: possiblePaths.filter(path => path && existsSync(path)),
        systemInfo: {},
        puppeteerTest: null
      };
      
      // System chromium detection
      try {
        const { stdout } = await execAsync('which chromium-browser || which chromium || which google-chrome');
        diagnostics.systemInfo.chromiumLocation = stdout.trim();
      } catch (error) {
        diagnostics.systemInfo.error = 'Chromium not found in PATH';
      }
      
      // Test puppeteer launch
      try {
        console.log('🧪 Testing puppeteer launch...');
        const puppeteer = require('puppeteer');
        
        const browserOptions: any = { 
          headless: 'new',
          timeout: 10000,
          args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage'
          ]
        };
        
        if (diagnostics.existingPaths.length > 0) {
          browserOptions.executablePath = diagnostics.existingPaths[0];
        }
        
        const browser = await puppeteer.launch(browserOptions);
        const version = await browser.version();
        await browser.close();
        
        diagnostics.puppeteerTest = {
          success: true,
          browserVersion: version,
          executableUsed: browserOptions.executablePath || 'bundled'
        };
        
        console.log('✅ Puppeteer test successful');
      } catch (puppeteerError) {
        console.error('❌ Puppeteer test failed:', puppeteerError);
        diagnostics.puppeteerTest = {
          success: false,
          error: puppeteerError.message,
          stack: puppeteerError.stack
        };
      }
      
      res.json(diagnostics);
    } catch (error) {
      console.error('❌ PDF დიაგნოსტიკის შეცდომა:', error);
      res.status(500).json({ message: 'დიაგნოსტიკის შეცდომა', error: error.message });
    }
  }

  // File serving endpoint removed - photos are now stored as base64 in database

  // Excel რეპორტის გენერაცია POST მეთოდით - სრული დოკუმენტის მონაცემებით
  @Post('generate-excel')
  async generateExcelFromData(@Body() documentData: any, @Res() res: Response) {
    try {
      console.log('📊 Excel რეპორტის გენერაცია POST მონაცემებით:', {
        title: documentData.title,
        hazardsCount: documentData.hazards?.length || 0,
        risksCount: documentData.risks?.length || 0
      });

      // ვამოწმებთ მონაცემების ფორმატს - hazards ან risks
      let processedData = documentData;
      if (documentData.risks && !documentData.hazards) {
        // ვარსებულობს risks ნაცვლად hazards-ისა, გადავცვალოთ
        processedData = {
          ...documentData,
          hazards: documentData.risks
        };
        console.log('🔄 Converted risks to hazards format for Excel generation');
      }

      const excelBuffer = await this.reportService.generateExcelReport(processedData);
      
      const fileName = `რისკების-შეფასება-${processedData.project || 'document'}-${new Date().toISOString().split('T')[0]}.xlsx`;
      
      res.set({
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(fileName)}"`,
        'Content-Length': excelBuffer.length.toString(),
      });
      res.send(excelBuffer);
      
      console.log(`✅ Excel რეპორტი გენერირდა წარმატებით, ზომა: ${excelBuffer.length} bytes`);
    } catch (error) {
      console.error('❌ Excel რეპორტის POST გენერაციის შეცდომა:', error);
      res.status(500).json({ message: 'Excel რეპორტის გენერაცია ვერ მოხერხდა', error: error.message });
    }
  }
}