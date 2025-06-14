import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SubscriptionGuard } from '../subscriptions/guards/subscription.guard';
import { IUser } from '../models/User';

@Controller('documents')
@UseGuards(JwtAuthGuard, SubscriptionGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  async create(@Body() createDocumentDto: CreateDocumentDto, @Request() req: { user: IUser }) {
    return this.documentsService.create({ ...createDocumentDto, authorId: req.user._id });
  }

  @Get()
  async findAll() {
    return this.documentsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.documentsService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.documentsService.remove(id);
  }
} 