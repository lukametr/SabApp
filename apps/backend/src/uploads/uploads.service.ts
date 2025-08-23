import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class UploadsService {
  async processBase64Image(base64String: string): Promise<string> {
    // If already a URL, return as-is
    if (typeof base64String === 'string' && base64String.startsWith('http')) {
      return base64String;
    }

    if (typeof base64String !== 'string' || !base64String.startsWith('data:image/')) {
      throw new BadRequestException('Invalid image format');
    }

    // TODO: Persist to CDN or file storage if needed. For now, keep base64 in DB
    return base64String;
  }
}
