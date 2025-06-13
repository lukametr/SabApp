import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'აპლიკაციის სტატუსი' })
  @ApiResponse({ status: 200, description: 'აპლიკაცია მუშაობს' })
  getStatus() {
    return this.appService.getStatus();
  }
}
