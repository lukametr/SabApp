import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { Document } from './schemas/document.schema';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import * as fs from 'fs';
import * as path from 'path';
import archiver from 'archiver';
// Note: no imports from './utils/merge-hazards' are used in this service now.

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(Document.name) private documentModel: Model<Document>
  ) {}

  async create(createDocumentDto: CreateDocumentDto, userId?: string): Promise<Document> {
    try {
      console.log('💾 Creating document with data:', {
        hazardsCount: Array.isArray(createDocumentDto.hazards) ? createDocumentDto.hazards.length : 0,
        photosCount: createDocumentDto.photos?.length || 0,
        userId: userId || 'anonymous',
        time: createDocumentDto.time,
        timeType: typeof createDocumentDto.time,
        timeValid: createDocumentDto.time instanceof Date,
        date: createDocumentDto.date,
        dateType: typeof createDocumentDto.date,
        hazardPhotos: Array.isArray(createDocumentDto.hazards) ? createDocumentDto.hazards.map((h: any) => ({
          id: h.id,
          photosCount: h.photos?.length || 0
        })) : []
      });
      
      const createdDocument = new this.documentModel({
        ...createDocumentDto,
        authorId: userId || 'anonymous-user', // Use provided userId or default
        photos: createDocumentDto.photos || [], // დავამატოთ ფოტოების სახელები
        isFavorite: false,
        assessmentA: 0,
        assessmentSh: 0,
  assessmentR: 0,
  // ჩამოტვირთვების მრიცხველები ყოველთვის იწყება ნულიდან
  downloadZipCount: 0,
  downloadExcelCount: 0,
  downloadPdfCount: 0,
      });
      
      console.log('💾 Saving document to database...');
      const savedDocument = await createdDocument.save();
      console.log('✅ Document saved successfully:', {
        id: savedDocument._id,
        hazardsCount: savedDocument.hazards?.length || 0,
        photosCount: savedDocument.photos?.length || 0
      });
      
      return savedDocument.toJSON() as Document;
    } catch (error) {
      console.error('❌ Error creating document:', {
        message: error.message,
        stack: error.stack,
        validation: error.errors
      });
      throw error;
    }
  }

  async findAll(userId?: string): Promise<Document[]> {
    // If userId is provided, filter by authorId, otherwise return all (for backward compatibility)
    const filter = userId ? { authorId: userId } : {};
    const documents = await this.documentModel.find(filter).exec();
    console.log('📋 Found', documents.length, 'documents for user:', userId || 'all users');
    documents.forEach((doc, index) => {
      console.log(`📋 Document ${index + 1}:`, {
        id: doc._id,
        authorId: doc.authorId,
        hazardsCount: doc.hazards?.length || 0,
        photosCount: doc.photos?.length || 0,
        hazardPhotos: doc.hazards?.map((h: any) => ({
          id: h.id,
          photosCount: h.photos?.length || 0
        })) || []
      });
    });
    
    // Convert to JSON to apply transform (_id -> id)
    return documents.map(doc => doc.toJSON()) as Document[];
  }

  async findOne(id: string, userId?: string): Promise<Document> {
    // Build filter - if userId provided, ensure document belongs to user
    const filter: any = { _id: id };
    if (userId) {
      filter.authorId = userId;
    }
    
    const document = await this.documentModel.findOne(filter).exec();
    if (!document) {
      throw new NotFoundException('დოკუმენტი ვერ მოიძებნა ან წვდომა არ გაქვთ');
    }
    return document.toJSON() as Document;
  }

  async remove(id: string, userId?: string): Promise<Document> {
    console.log('🗑️ Removing document with ID:', id, 'for user:', userId);
    
    if (!id || id === 'undefined') {
      console.error('❌ Invalid ID provided for deletion:', id);
      throw new NotFoundException('არასწორი დოკუმენტის ID');
    }
    
    // Build filter - if userId provided, ensure document belongs to user
    const filter: any = { _id: id };
    if (userId) {
      filter.authorId = userId;
    }
    
    const deletedDocument = await this.documentModel.findOneAndDelete(filter).exec();
    if (!deletedDocument) {
      throw new NotFoundException('დოკუმენტი ვერ მოიძებნა ან წვდომა არ გაქვთ');
    }
    console.log('✅ Document deleted successfully:', deletedDocument._id);
    return deletedDocument.toJSON() as Document;
  }

  async update(id: string, updateDocumentDto: UpdateDocumentDto, _userId?: string): Promise<Document> {
    // მოვიძიოთ არსებული დოკუმენტი
    const existingDoc = await this.documentModel.findById(id);
    if (!existingDoc) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    // გავფილტროთ undefined მნიშვნელობები
    const updateData: any = {};
    Object.keys(updateDocumentDto).forEach((key) => {
      const value = (updateDocumentDto as any)[key];
      if (value !== undefined) {
        (updateData as any)[key] = value;
      }
    });

    // დავამატოთ updatedAt თარიღი
    updateData.updatedAt = new Date();

    // შევასრულოთ partial update - განახლდება მხოლოდ გადმოცემული ფილდები
    const updated = await this.documentModel
      .findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      )
      .exec();

    if (!updated) {
      throw new NotFoundException('დოკუმენტი ვერ მოიძებნა ან წვდომა არ გაქვთ');
    }

    return updated.toJSON() as Document;
  }

  async toggleFavorite(id: string): Promise<Document> {
    const document = await this.documentModel.findById(id).exec();
    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    document.isFavorite = !document.isFavorite;
    return document.save();
  }

  async updateAssessment(
    id: string,
    assessmentA: number,
    assessmentSh: number,
    assessmentR: number,
  ): Promise<Document> {
    const document = await this.documentModel.findById(id).exec();
    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    document.assessmentA = assessmentA;
    document.assessmentSh = assessmentSh;
    document.assessmentR = assessmentR;
    return document.save();
  }

  async getDocumentFile(id: string): Promise<Buffer> {
    const document = await this.documentModel.findById(id).exec();
    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

  // Check if document has any photos (document photos or hazard photos)
  const hasDocumentPhotos = document.photos && document.photos.length > 0;
  const hasHazardPhotos = document.hazards && document.hazards.some(hazard => hazard.photos && hazard.photos.length > 0);

    console.log(`🔍 Document ${id} - hasDocumentPhotos: ${hasDocumentPhotos}, hasHazardPhotos: ${hasHazardPhotos}`);

    // If we have photos, decide whether they are file paths or base64 and build a ZIP accordingly
    if (hasDocumentPhotos || hasHazardPhotos) {
      const archive = archiver('zip', { zlib: { level: 9 } });

      // Helper to add a photo entry which can be base64 or /uploads path
      const addPhoto = (photo: string, namePrefix: string, index: number) => {
        try {
          if (typeof photo !== 'string') return;
          if (photo.startsWith('/uploads/')) {
            const filePath = path.join(process.cwd(), photo.replace(/^\/+/, ''));
            if (fs.existsSync(filePath)) {
              archive.file(filePath, { name: `${namePrefix}-${index + 1}${path.extname(filePath)}` });
            }
            return;
          }
          const matches = photo.match(/^data:([^;]+);base64,(.+)$/);
          if (matches) {
            const mimeType = matches[1];
            const base64Data = matches[2];
            const buffer = Buffer.from(base64Data, 'base64');
            const extension = (mimeType.split('/')[1] || 'jpg').split(';')[0];
            archive.append(buffer, { name: `${namePrefix}-${index + 1}.${extension}` });
          }
        } catch (e) {
          // ignore single photo failure
        }
      };

      // Document photos
      (document.photos || []).forEach((p: any, i: number) => addPhoto(p, 'document-photo', i));
      // Hazard photos
      (document.hazards || []).forEach((h: any, hi: number) => {
        (h.photos || []).forEach((p: any, pi: number) => addPhoto(p, `hazard-${hi + 1}-photo`, pi));
      });

      archive.finalize();
      return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        archive.on('data', (chunk: Buffer) => chunks.push(chunk));
        archive.on('end', () => resolve(Buffer.concat(chunks)));
        archive.on('error', (err: Error) => reject(err));
      });
    }

    // Handle old documents with file paths (legacy support)
    if (!document.filePath) {
      throw new NotFoundException(`No file or photos found for document with ID ${id}`);
    }

    const filePath = path.join(process.cwd(), 'uploads', document.filePath);
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException(`File not found at path: ${filePath}`);
    }

    return fs.readFileSync(filePath);
  }

  async getMultipleDocumentFiles(ids: string[]): Promise<Buffer> {
    const documents = await this.documentModel
      .find({ _id: { $in: ids } })
      .exec();

    if (documents.length === 0) {
      throw new NotFoundException('No documents found');
    }

    const archive = archiver('zip', {
      zlib: { level: 9 }
    });

    const files = documents.map(doc => {
      if (!doc.filePath) {
        return null;
      }

      const filePath = path.join(process.cwd(), 'uploads', doc.filePath);
      if (!fs.existsSync(filePath)) {
        return null;
      }

      return {
        name: doc.filePath,
        path: filePath
      };
    }).filter(Boolean);

    if (files.length === 0) {
      throw new NotFoundException('No files found for the selected documents');
    }

    files.forEach(file => {
      if (file) {
        archive.file(file.path, { name: file.name });
      }
    });

    archive.finalize();

    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      archive.on('data', (chunk: Buffer) => chunks.push(chunk));
      archive.on('end', () => resolve(Buffer.concat(chunks)));
      archive.on('error', (err: Error) => reject(err));
    });
  }

  async incrementDownloadCounter(id: string, type: 'zip' | 'excel' | 'pdf'): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return; // ignore silently for invalid ids
    }
    const inc: any = {};
    switch (type) {
      case 'zip':
        inc.downloadZipCount = 1; break;
      case 'excel':
        inc.downloadExcelCount = 1; break;
      case 'pdf':
        inc.downloadPdfCount = 1; break;
    }
    await this.documentModel.updateOne({ _id: id }, { $inc: inc }).exec();
  }

  async createZip(files: Express.Multer.File[]): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      const archive = archiver('zip', {
        zlib: { level: 9 }
      });

      archive.on('data', (chunk: Buffer) => chunks.push(chunk));
      archive.on('end', () => resolve(Buffer.concat(chunks)));
      archive.on('error', (err: Error) => reject(err));

      files.forEach(file => {
        if (file && file.path && file.originalname) {
          archive.file(file.path, { name: file.originalname });
        }
      });

      archive.finalize();
    });
  }

  // Legacy ZIP method removed; getDocumentFile now supports both file paths and base64 inline

  async deletePhoto(id: string, photoIndex: number): Promise<Document> {
    const document = await this.documentModel.findById(id).exec();
    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    // წავშალოთ photo მასივიდან ინდექსით
    if (document.photos && document.photos[photoIndex]) {
      document.photos.splice(photoIndex, 1);
    }
    
    return document.save();
  }

  async getPhoto(id: string, photoIndex: number): Promise<string> {
    const document = await this.documentModel.findById(id).exec();
    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    if (!document.photos || !document.photos[photoIndex]) {
      throw new NotFoundException(`Photo at index ${photoIndex} not found`);
    }

    // დავაბრუნოთ base64 string
    return document.photos[photoIndex];
  }
}