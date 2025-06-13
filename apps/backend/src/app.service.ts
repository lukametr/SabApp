import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getStatus() {
    return {
      status: 'ok',
      message: 'SabaP API მუშაობს',
      timestamp: new Date().toISOString(),
    };
  }
}
