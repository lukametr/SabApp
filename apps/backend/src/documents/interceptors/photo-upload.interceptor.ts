import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class PhotoUploadInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const body = request.body;

    try {
      // Production-ზე არ ვინახავთ ფაილებს, ვტოვებთ base64-ად
      console.log('📸 PhotoUploadInterceptor: Processing request');
      
      // მხოლოდ ვალიდაცია - photos უნდა იყოს მასივი
      if (body.photos && !Array.isArray(body.photos)) {
        body.photos = [];
      }
      
      // hazards ვალიდაცია
      if (body.hazards && Array.isArray(body.hazards)) {
        body.hazards.forEach((hazard: any) => {
          if (hazard.photos && !Array.isArray(hazard.photos)) {
            hazard.photos = [];
          }
        });
      }
      
      console.log('📸 Validation complete - photos will be stored as base64 in MongoDB');
    } catch (error) {
      console.error('❌ PhotoUploadInterceptor error:', error);
    }

    return next.handle();
  }
}
