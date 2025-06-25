import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
    const createdDocument = new this.documentModel({
      ...createDocumentDto,
      authorId: 'default-user', // TODO: Get from authentication
      photos: createDocumentDto.photos || [], // დავამატოთ ფოტოების სახელები
    });
    return createdDocument.save();
  }

  async findAll(): Promise<Document[]> {
    return this.documentModel.find().exec();
  }

  async findOne(id: string): Promise<Document> {
    const document = await this.documentModel.findById(id).exec();
    if (!document) {
      throw new NotFoundException('დოკუმენტი ვერ მოიძებნა');
    }
    return document;
  }

  async remove(id: string): Promise<Document> {
    const deletedDocument = await this.documentModel.findByIdAndDelete(id).exec();
    if (!deletedDocument) {
      throw new NotFoundException('დოკუმენტი ვერ მოიძებნა');
    }
    return deletedDocument;
  }

  async update(id: string, updateDocumentDto: UpdateDocumentDto): Promise<Document> {
    const document = await this.documentModel
      .findByIdAndUpdate(id, updateDocumentDto, { new: true })
      .exec();
    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }
    return document;
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

    if (!document.filePath) {
      throw new NotFoundException(`No file found for document with ID ${id}`);
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
} 