import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';

@Injectable()
export class PhotoUploadInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    try {
      console.log('📸 PhotoUploadInterceptor: Starting photo processing');
      const request = context.switchToHttp().getRequest();
      const body = request.body || {};

      const uploadsDir = path.join(process.cwd(), 'uploads', 'photos');
      console.log('📸 Uploads directory:', uploadsDir);
      
      if (!fs.existsSync(uploadsDir)) {
        console.log('📸 Creating uploads directory...');
        fs.mkdirSync(uploadsDir, { recursive: true });
        console.log('📸 Uploads directory created successfully');
      }

      const saveIfBase64 = (photo: string): string => {
        if (typeof photo !== 'string') return photo as any;
        if (photo.startsWith('/uploads/')) return photo;
        if (photo.startsWith('http://') || photo.startsWith('https://')) return photo;
        const match = photo.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);
        if (!match) return photo;
        const ext = match[1] || 'jpg';
        const data = match[2];
        const fileName = `${randomUUID()}.${ext}`;
        const filePath = path.join(uploadsDir, fileName);
        try {
          console.log(`📸 Saving photo: ${fileName}`);
          fs.writeFileSync(filePath, Buffer.from(data, 'base64'));
          console.log(`📸 Photo saved successfully: ${fileName}`);
          return `/uploads/photos/${fileName}`;
        } catch (error) {
          console.error(`📸 Error saving photo ${fileName}:`, error);
          return photo;
        }
      };

      // document-level photos
      if (Array.isArray(body.photos)) {
        console.log(`📸 Processing ${body.photos.length} document photos`);
        body.photos = body.photos.map(saveIfBase64);
      }

      // hazards photos
      if (Array.isArray(body.hazards)) {
        const hazardPhotosCount = (body.hazards as any[]).reduce(
          (count: number, hazard: any) => count + (Array.isArray(hazard?.photos) ? hazard.photos.length : 0),
          0
        );
        console.log(`📸 Processing ${hazardPhotosCount} hazard photos`);
        body.hazards = body.hazards.map((hazard: any) => {
          if (hazard && Array.isArray(hazard.photos)) {
            hazard.photos = hazard.photos.map(saveIfBase64);
          }
          return hazard;
        });
      }

      console.log('📸 PhotoUploadInterceptor: Photo processing completed');
      return next.handle();
    } catch (error) {
      console.error('📸 PhotoUploadInterceptor: Unexpected error:', error);
      return next.handle();
    }
  }
}
