import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Res,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SubscriptionGuard } from '../subscriptions/guards/subscription.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { Document } from './entities/document.entity';
import { Response } from 'express';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('documents')
@ApiBearerAuth()
@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @UseGuards(SubscriptionGuard)
  @ApiOperation({ summary: 'ახალი დოკუმენტის შექმნა' })
  @ApiResponse({ status: 201, description: 'დოკუმენტი წარმატებით შეიქმნა' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('photos', 10))
  async create(
    @Body() createDocumentDto: Partial<Document>,
    @UploadedFiles() photos: Express.Multer.File[],
    @Req() req: any,
  ) {
    return this.documentsService.create({
      ...createDocumentDto,
      photos: photos?.map(photo => photo.filename) || [],
      authorId: req.user.id,
    });
  }

  @Get()
  @ApiOperation({ summary: 'ყველა დოკუმენტის მიღება' })
  @ApiResponse({ status: 200, description: 'წარმატებული მიღება' })
  async findAll() {
    return this.documentsService.findAll();
  }

  @Get('my')
  @ApiOperation({ summary: 'მომხმარებლის დოკუმენტების მიღება' })
  @ApiResponse({ status: 200, description: 'წარმატებული მიღება' })
  findMyDocuments(@Req() req: any) {
    return this.documentsService.findByAuthor(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'დოკუმენტის მიღება ID-ით' })
  @ApiResponse({ status: 200, description: 'წარმატებული მიღება' })
  @ApiResponse({ status: 404, description: 'დოკუმენტი ვერ მოიძებნა' })
  async findOne(@Param('id') id: string) {
    return this.documentsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(SubscriptionGuard)
  @ApiOperation({ summary: 'დოკუმენტის განახლება' })
  @ApiResponse({ status: 200, description: 'წარმატებული განახლება' })
  @ApiResponse({ status: 404, description: 'დოკუმენტი ვერ მოიძებნა' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('photos', 10))
  async update(
    @Param('id') id: string,
    @Body() updateDocumentDto: Partial<Document>,
    @UploadedFiles() photos: Express.Multer.File[],
  ) {
    return this.documentsService.update(id, {
      ...updateDocumentDto,
      photos: photos?.map(photo => photo.filename) || [],
    });
  }

  @Delete(':id')
  @UseGuards(SubscriptionGuard)
  @ApiOperation({ summary: 'დოკუმენტის წაშლა' })
  @ApiResponse({ status: 200, description: 'წარმატებული წაშლა' })
  @ApiResponse({ status: 404, description: 'დოკუმენტი ვერ მოიძებნა' })
  async remove(@Param('id') id: string) {
    return this.documentsService.remove(id);
  }

  @Post(':id/favorite')
  @UseGuards(SubscriptionGuard)
  @ApiOperation({ summary: 'დოკუმენტის რჩეულებში დამატება/წაშლა' })
  @ApiResponse({ status: 200, description: 'წარმატებული ოპერაცია' })
  async toggleFavorite(@Param('id') id: string) {
    return this.documentsService.toggleFavorite(id);
  }

  @Patch(':id/assessment')
  @UseGuards(SubscriptionGuard)
  @ApiOperation({ summary: 'დოკუმენტის შეფასების განახლება' })
  @ApiResponse({ status: 200, description: 'წარმატებული განახლება' })
  async updateAssessment(
    @Param('id') id: string,
    @Body() assessment: { assessmentA: number; assessmentSh: number; assessmentR: number },
  ) {
    return this.documentsService.updateAssessment(
      id,
      assessment.assessmentA,
      assessment.assessmentSh,
      assessment.assessmentR,
    );
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'დოკუმენტის ჩამოტვირთვა' })
  @ApiResponse({ status: 200, description: 'წარმატებული ჩამოტვირთვა' })
  async downloadDocument(@Param('id') id: string, @Res() res: Response) {
    const fileBuffer = await this.documentsService.getDocumentFile(id);
    const document = await this.documentsService.findOne(id);
    
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${document.filePath}"`,
      'Content-Length': fileBuffer.length,
    });
    
    res.send(fileBuffer);
  }

  @Post('download-multiple')
  @ApiOperation({ summary: 'რამდენიმე დოკუმენტის ჩამოტვირთვა' })
  @ApiResponse({ status: 200, description: 'წარმატებული ჩამოტვირთვა' })
  async downloadMultipleDocuments(
    @Body() body: { ids: string[] },
    @Res() res: Response,
  ) {
    const zipBuffer = await this.documentsService.getMultipleDocumentFiles(body.ids);
    
    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="documents.zip"',
      'Content-Length': zipBuffer.length,
    });
    
    res.send(zipBuffer);
  }

  @Delete(':id/photo/:photoName')
  @ApiOperation({ summary: 'ფოტოს წაშლა' })
  @ApiResponse({ status: 200, description: 'ფოტო წარმატებით წაიშალა' })
  async deletePhoto(
    @Param('id') id: string,
    @Param('photoName') photoName: string,
  ) {
    return this.documentsService.deletePhoto(id, photoName);
  }
} 