import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { existsSync, readdirSync } from 'fs';
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

  @Get('debug')
  debugInfo() {
    const currentDir = process.cwd();
    const frontendPath = join(currentDir, 'apps/frontend/out');
    const indexPath = join(frontendPath, 'index.html');
    
    try {
      const frontendExists = existsSync(frontendPath);
      const indexExists = existsSync(indexPath);
      const frontendContents = frontendExists ? readdirSync(frontendPath) : [];
      
      return {
        currentDir,
        frontendPath,
        indexPath,
        frontendExists,
        indexExists,
        frontendContents,
        env: {
          NODE_ENV: process.env.NODE_ENV,
          PORT: process.env.PORT,
          CORS_ORIGIN: process.env.CORS_ORIGIN,
        }
      };
    } catch (error) {
      return {
        error: error.message,
        currentDir,
        frontendPath,
        indexPath,
      };
    }
  }

  @Get('*')
  serveFrontend(@Res() res: Response) {
    const indexPath = join(process.cwd(), 'apps/frontend/out/index.html');
    console.log('Looking for frontend at:', indexPath);
    console.log('File exists:', existsSync(indexPath));
    console.log('Current working directory:', process.cwd());
    
    if (existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(HttpStatus.NOT_FOUND).json({
        message: 'Frontend not found. Please ensure the frontend is built.',
        path: indexPath,
        currentDir: process.cwd(),
        exists: existsSync(indexPath),
        debug: 'Try visiting /debug endpoint for more information',
      });
    }
  }
}
