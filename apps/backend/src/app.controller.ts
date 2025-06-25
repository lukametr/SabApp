import { Controller, Get, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { join } from 'path';

@ApiTags('app')
@Controller()
export class AppController {
  @Get('health')
  @ApiOperation({ summary: 'აპლიკაციის ჯანმრთელობის შემოწმება' })
  @ApiResponse({ status: 200, description: 'აპლიკაცია მუშაობს' })
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version || '1.0.0',
    };
  }
}

@ApiTags('root')
@Controller()
export class RootController {
  @Get()
  @ApiOperation({ summary: 'აპლიკაციის მთავარი გვერდი' })
  @ApiResponse({ status: 200, description: 'ფრონტენდის მთავარი გვერდი' })
  serveFrontend(@Res() res: Response) {
    res.sendFile(join(__dirname, '..', '..', '..', 'apps', 'frontend', 'out', 'index.html'));
  }
}
