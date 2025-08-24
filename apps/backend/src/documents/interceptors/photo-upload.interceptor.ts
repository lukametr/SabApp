import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class PhotoUploadInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const body = request.body;

    try {
      console.log('📸 PhotoUploadInterceptor: Processing request');

      // Validate and process photos array
      if (body.photos) {
        if (!Array.isArray(body.photos)) {
          body.photos = [];
        } else {
          // Validate each photo has required structure
          body.photos = body.photos.filter(
            (photo: any) => photo && typeof photo === 'string' && photo.startsWith('data:image/')
          );
        }
      }

      // Process hazards photos
      if (body.hazards && Array.isArray(body.hazards)) {
        body.hazards = body.hazards.map((hazard: any) => {
          if (hazard.photos) {
            if (!Array.isArray(hazard.photos)) {
              hazard.photos = [];
            } else {
              // Validate each hazard photo
              hazard.photos = hazard.photos.filter(
                (photo: any) => photo && typeof photo === 'string' && photo.startsWith('data:image/')
              );
            }
          }
          return hazard;
        });
      }

      console.log('📸 Validation complete - processed photos count:', {
        mainPhotos: body.photos?.length || 0,
        hazardPhotos:
          (body.hazards?.reduce(
            (acc: number, h: any) => acc + (Array.isArray(h.photos) ? h.photos.length : 0),
            0
          ) as number) || 0,
      });
    } catch (error) {
      console.error('❌ PhotoUploadInterceptor error:', error);
    }

    return next.handle();
  }
}
