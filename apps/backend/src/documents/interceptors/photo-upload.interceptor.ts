import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';

@Injectable()
export class PhotoUploadInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const body = request.body || {};

    const uploadsDir = path.join(process.cwd(), 'uploads', 'photos');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
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
        fs.writeFileSync(filePath, Buffer.from(data, 'base64'));
        return `/uploads/photos/${fileName}`;
      } catch {
        return photo;
      }
    };

    // document-level photos
    if (Array.isArray(body.photos)) {
      body.photos = body.photos.map(saveIfBase64);
    }

    // hazards photos
    if (Array.isArray(body.hazards)) {
      body.hazards = body.hazards.map((hazard: any) => {
        if (hazard && Array.isArray(hazard.photos)) {
          hazard.photos = hazard.photos.map(saveIfBase64);
        }
        return hazard;
      });
    }

    return next.handle();
  }
}
