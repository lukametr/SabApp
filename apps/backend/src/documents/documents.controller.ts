import { Controller, Get, Post, Body, Param, Delete, UseInterceptors, UploadedFiles, Patch, Res } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'photos', maxCount: 10 },
    { name: 'hazardPhotos', maxCount: 50 }
  ]))
  async create(@Body() createDocumentDto: CreateDocumentDto, @UploadedFiles() files: any) {
    try {
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
    
    return this.documentsService.create(documentWithPhotos);
    } catch (error) {
      console.error('❌ Error creating document:', error);
      throw error;
    }
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
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'photos', maxCount: 10 },
    { name: 'hazardPhotos', maxCount: 50 }
  ]))
  async update(@Param('id') id: string, @Body() updateDocumentDto: UpdateDocumentDto, @UploadedFiles() files: any) {
    try {
      console.log('📋 Updating document:', id, updateDocumentDto);
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
    
    return this.documentsService.update(id, documentWithPhotos);
    } catch (error) {
      console.error('❌ Error updating document:', error);
      throw error;
    }
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

  // File serving endpoint removed - photos are now stored as base64 in database
}