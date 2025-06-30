import { Controller, Get, Res, HttpStatus, All } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { existsSync, readdirSync, readFileSync } from 'fs';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('app')
@Controller()
export class AppController {
  // @Get()
  // @ApiOperation({ summary: 'Root endpoint' })
  // @ApiResponse({ status: 200, description: 'SabApp API is running' })
  // getRoot(@Res() res: Response) {
  //   // გადამისამართება ფრონტენდის Next.js აპზე
  //   return res.redirect('/_next/static');
  // }

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

  @Get('/health')
  getRootHealth(@Res() res: Response) {
    // იგივე პასუხი, რაც /api/health-ზე
    return res.status(HttpStatus.OK).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version || '1.0.0',
    });
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

  // Catch-all route for SPA routing
  @All('*')
  serveFrontend(@Res() res: Response) {
    const frontendPath = join(process.cwd(), 'apps/frontend/out');
    const indexPath = join(frontendPath, 'index.html');
    
    // Check if the requested path exists as a static file
    const requestedPath = join(frontendPath, res.req.url || '/');
    
    if (existsSync(requestedPath) && !res.req.url?.startsWith('/api')) {
      // Serve the static file if it exists
      return res.sendFile(requestedPath);
    }
    
    // Serve index.html for SPA routing
    if (existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }
    
    // Fallback to 404
    return res.status(404).json({ error: 'Not found' });
  }
}
