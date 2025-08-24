import { Controller, Get, Post, Body, Param, Delete, UseInterceptors, Patch, Res, UseGuards, Request } from '@nestjs/common';
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
import { PhotoUploadInterceptor } from './interceptors/photo-upload.interceptor';

@Controller('documents')
export class DocumentsController {
  constructor(
    private readonly documentsService: DocumentsService,
    private readonly reportService: ReportService
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, SubscriptionGuard)
  @UseInterceptors(PhotoUploadInterceptor)
  async create(@Body() createDocumentDto: CreateDocumentDto, @Request() req: any) {
    try {
      const userId = req.user?.id || req.user?.sub; // Get user ID from JWT token
      console.log('📋 Creating document for user:', userId || 'anonymous');
  console.log('📋 Received document data:', createDocumentDto);
  // Files interceptor removed; photos expected as base64 strings in DTO
      
      // Validate required fields
      if (!createDocumentDto.evaluatorName || !createDocumentDto.evaluatorLastName || 
          !createDocumentDto.objectName || !createDocumentDto.workDescription) {
        throw new Error('Required fields are missing');
      }
      
      // Validate dates
      if (!createDocumentDto.date || !createDocumentDto.time) {
        throw new Error('Date and time are required');
      }
    
    // Create document directly; interceptor has already processed photos/hazards
    const documentWithPhotos = {
      ...createDocumentDto,
      photos: createDocumentDto.photos || []
    };
    
    console.log('✅ Final document data:', {
      hazardsCount: Array.isArray(createDocumentDto.hazards) ? createDocumentDto.hazards.length : 0,
      photosCount: Array.isArray(createDocumentDto.photos) ? createDocumentDto.photos.length : 0
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
  @UseInterceptors(PhotoUploadInterceptor)
  async update(@Param('id') id: string, @Body() updateDocumentDto: UpdateDocumentDto, @Request() req: any) {
    try {
      const userId = req.user?.id || req.user?.sub; // Get user ID from JWT token
      console.log('📋 Updating document:', id, 'for user:', userId || 'anonymous');
      console.log('📋 Update data:', updateDocumentDto);
  // Files interceptor removed; photos expected as base64 strings in DTO
      
      // Validate ID
      if (!id || id.trim() === '') {
        throw new Error('Document ID is required');
      }
    
    // Build update payload directly from DTO; interceptor handles photos/hazards processing
    const documentUpdate: any = { ...updateDocumentDto };
    
    // Omit undefined fields to avoid unsetting existing values
    Object.keys(documentUpdate).forEach((k) => {
      if (documentUpdate[k] === undefined) {
        delete documentUpdate[k];
      }
    });

    console.log('✅ Final update payload summary:', {
      fieldsCount: Object.keys(documentUpdate).length,
      hasHazards: documentUpdate.hazards !== undefined,
      hasPhotos: documentUpdate.photos !== undefined
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
      // increment ZIP download counter (legacy zip of photos or file)
      try {
        await this.documentsService.incrementDownloadCounter(id, 'zip');
      } catch (e) {
        console.warn('⚠️ Failed to increment ZIP download counter:', e?.message);
      }
      
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
      // increment Excel download counter
      try {
        await this.documentsService.incrementDownloadCounter(id, 'excel');
      } catch (e) {
        console.warn('⚠️ Failed to increment Excel download counter:', e?.message);
      }
      
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
      // increment PDF download counter
      try {
        await this.documentsService.incrementDownloadCounter(id, 'pdf');
      } catch (e) {
        console.warn('⚠️ Failed to increment PDF download counter:', e?.message);
      }
      
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