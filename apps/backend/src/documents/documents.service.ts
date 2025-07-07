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

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(Document.name) private documentModel: Model<Document>
  ) {}

  async create(createDocumentDto: CreateDocumentDto): Promise<Document> {
    try {
      console.log('💾 Creating document with data:', {
        hazardsCount: Array.isArray(createDocumentDto.hazards) ? createDocumentDto.hazards.length : 0,
        photosCount: createDocumentDto.photos?.length || 0,
        hazardPhotos: Array.isArray(createDocumentDto.hazards) ? createDocumentDto.hazards.map((h: any) => ({
          id: h.id,
          photosCount: h.photos?.length || 0
        })) : []
      });
      
      const createdDocument = new this.documentModel({
        ...createDocumentDto,
        authorId: 'default-user', // TODO: Get from authentication
        photos: createDocumentDto.photos || [], // დავამატოთ ფოტოების სახელები
        isFavorite: false,
        assessmentA: 0,
        assessmentSh: 0,
        assessmentR: 0,
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
      console.error('❌ Error creating document:', error);
      throw error;
    }
  }

  async findAll(): Promise<Document[]> {
    const documents = await this.documentModel.find().exec();
    console.log('📋 Found', documents.length, 'documents');
    documents.forEach((doc, index) => {
      console.log(`📋 Document ${index + 1}:`, {
        id: doc._id,
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

  async findOne(id: string): Promise<Document> {
    const document = await this.documentModel.findById(id).exec();
    if (!document) {
      throw new NotFoundException('დოკუმენტი ვერ მოიძებნა');
    }
    return document.toJSON() as Document;
  }

  async remove(id: string): Promise<Document> {
    console.log('🗑️ Removing document with ID:', id);
    
    if (!id || id === 'undefined') {
      console.error('❌ Invalid ID provided for deletion:', id);
      throw new NotFoundException('არასწორი დოკუმენტის ID');
    }
    
    const deletedDocument = await this.documentModel.findByIdAndDelete(id).exec();
    if (!deletedDocument) {
      throw new NotFoundException('დოკუმენტი ვერ მოიძებნა');
    }
    console.log('✅ Document deleted successfully:', deletedDocument._id);
    return deletedDocument.toJSON() as Document;
  }

  async update(id: string, updateDocumentDto: UpdateDocumentDto): Promise<Document> {
    try {
      console.log('📋 Updating document in service:', id, {
        hazardsCount: updateDocumentDto.hazards?.length || 0,
        photosCount: updateDocumentDto.photos?.length || 0
      });
      
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new NotFoundException(`Invalid document ID: ${id}`);
      }
      
      const document = await this.documentModel
        .findByIdAndUpdate(id, updateDocumentDto, { new: true })
        .exec();
      if (!document) {
        throw new NotFoundException(`Document with ID ${id} not found`);
      }
      
      console.log('✅ Document updated successfully:', document._id);
      return document.toJSON() as Document;
    } catch (error) {
      console.error('❌ Error updating document:', error);
      throw error;
    }
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

    // Handle new documents with base64 photos
    if (document.photos && document.photos.length > 0) {
      return this.createDocumentZipFromBase64(document);
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

  async deletePhoto(id: string, photoName: string): Promise<Document> {
    const document = await this.documentModel.findById(id).exec();
    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    // წავშალოთ ფაილი
    const filePath = path.join(process.cwd(), 'uploads', photoName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // განვაახლოთ დოკუმენტი
    document.photos = document.photos.filter(photo => photo !== photoName);
    return document.save();
  }

  async getPhoto(id: string, photoName: string): Promise<Buffer> {
    const document = await this.documentModel.findById(id).exec();
    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    if (!document.photos.includes(photoName)) {
      throw new NotFoundException(`Photo ${photoName} not found in document`);
    }

    const filePath = path.join(process.cwd(), 'uploads', photoName);
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException(`Photo file not found at path: ${filePath}`);
    }

    return fs.readFileSync(filePath);
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

  private async createDocumentZipFromBase64(document: any): Promise<Buffer> {
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });

    // Create document info as JSON
    const documentInfo = {
      id: document._id,
      evaluatorName: document.evaluatorName,
      evaluatorLastName: document.evaluatorLastName,
      objectName: document.objectName,
      workDescription: document.workDescription,
      date: document.date,
      time: document.time,
      hazardsCount: document.hazards?.length || 0,
      photosCount: document.photos?.length || 0
    };

    // Add document info as JSON file
    archive.append(JSON.stringify(documentInfo, null, 2), { name: 'document-info.json' });

    // Add document photos
    if (document.photos && document.photos.length > 0) {
      document.photos.forEach((base64Photo: string, index: number) => {
        try {
          // Extract base64 data and mime type
          const matches = base64Photo.match(/^data:([^;]+);base64,(.+)$/);
          if (matches) {
            const mimeType = matches[1];
            const base64Data = matches[2];
            const buffer = Buffer.from(base64Data, 'base64');
            
            // Determine file extension
            const extension = mimeType.split('/')[1] || 'jpg';
            const fileName = `document-photo-${index + 1}.${extension}`;
            
            archive.append(buffer, { name: fileName });
          }
        } catch (error) {
          console.error('Error processing document photo:', error);
        }
      });
    }

    // Add hazard photos
    if (document.hazards && document.hazards.length > 0) {
      document.hazards.forEach((hazard: any, hazardIndex: number) => {
        if (hazard.photos && hazard.photos.length > 0) {
          hazard.photos.forEach((base64Photo: string, photoIndex: number) => {
            try {
              const matches = base64Photo.match(/^data:([^;]+);base64,(.+)$/);
              if (matches) {
                const mimeType = matches[1];
                const base64Data = matches[2];
                const buffer = Buffer.from(base64Data, 'base64');
                
                const extension = mimeType.split('/')[1] || 'jpg';
                const fileName = `hazard-${hazardIndex + 1}-photo-${photoIndex + 1}.${extension}`;
                
                archive.append(buffer, { name: fileName });
              }
            } catch (error) {
              console.error('Error processing hazard photo:', error);
            }
          });
        }
      });
    }

    archive.finalize();

    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      archive.on('data', (chunk: Buffer) => chunks.push(chunk));
      archive.on('end', () => resolve(Buffer.concat(chunks)));
      archive.on('error', (err: Error) => reject(err));
    });
  }
}