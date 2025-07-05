import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appService = app.get<AppService>(AppService);
  });

  describe('root', () => {
    it('should return app status', () => {
      expect(appService.getStatus()).toEqual({
        status: 'ok',
        message: 'SabaP API მუშაობს',
        timestamp: expect.any(String),
      });
    });
  });
});
