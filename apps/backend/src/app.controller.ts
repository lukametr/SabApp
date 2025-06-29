import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { existsSync } from 'fs';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('app')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Root endpoint' })
  @ApiResponse({ status: 200, description: 'SabApp API is running' })
  getRoot() {
    return {
      message: 'SabApp API is running',
      version: process.env.npm_package_version || '1.0.0',
      timestamp: new Date().toISOString(),
    };
  }

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

  @Get('*')
  serveFrontend(@Res() res: Response) {
    const indexPath = join(__dirname, '../../../frontend/out/index.html');
    
    if (existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(HttpStatus.NOT_FOUND).json({
        message: 'Frontend not found. Please ensure the frontend is built.',
        path: indexPath,
      });
    }
  }
}
