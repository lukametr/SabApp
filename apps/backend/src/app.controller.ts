import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { existsSync, readdirSync } from 'fs';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('app')
@Controller('api')
export class AppController {
  @Get()
  @ApiOperation({ summary: 'API Root endpoint' })
  @ApiResponse({ status: 200, description: 'SabApp API is running' })
  getRoot(@Res() res: Response) {
    return res.status(HttpStatus.OK).json({
      message: 'SabApp API is running',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      routes: {
        api: '/api',
        health: '/health',
        docs: '/docs',
        debug: '/debug'
      }
    });
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
    // Railway-ზე ფრონტენდის ფაილები არიან /app/apps/frontend/out-ზე
    const frontendPath = join(currentDir, '../frontend/out');
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

  @Get('api/debug')
  getApiDebug() {
    return {
      message: 'API is working!',
      timestamp: new Date().toISOString(),
      routes: {
        documents: '/api/documents',
        auth: '/api/auth',
        users: '/api/users',
        health: '/health',
        docs: '/docs'
      }
    };
  }

  // Catch-all route for SPA routing - disabled for now
  // @All('*')
  // serveFrontend(@Res() res: Response, @Req() req: Request) {
  //   const url = req.url || '/';
  //   const method = req.method;
  //   
  //   console.log(`[SPA Fallback] ${method} ${url}`);
  //   
  //   // Skip API routes and other backend routes
  //   if (url.startsWith('/api/') || 
  //       url.startsWith('/health') || 
  //       url.startsWith('/docs')) {
  //     console.log(`[SPA Fallback] Skipping API route: ${url}`);
  //     return res.status(404).json({ error: 'API endpoint not found' });
  //   }
  //   
  //   // Skip static files that should be served by ServeStaticModule
  //   if (url.includes('.') && !url.includes('?')) {
  //     console.log(`[SPA Fallback] Skipping static file: ${url}`);
  //     return res.status(404).json({ error: 'Static file not found' });
  //   }
  //   
  //   // Railway-ზე ფრონტენდის ფაილები არიან /app/apps/frontend/out-ზე
  //   const frontendPath = join(process.cwd(), '../frontend/out');
  //   const indexPath = join(frontendPath, 'index.html');
  //   
  //   console.log(`[SPA Fallback] Serving SPA for: ${url}`);
  //   console.log(`[SPA Fallback] Index path: ${indexPath}`);
  //   console.log(`[SPA Fallback] Index exists: ${existsSync(indexPath)}`);
  //   
  //   // Serve index.html for SPA routing
  //   if (existsSync(indexPath)) {
  //     return res.sendFile(indexPath);
  //   }
  //   
  //   // Fallback to 404
  //   console.log(`[SPA Fallback] Index not found, returning 404`);
  //   return res.status(404).json({ error: 'Not found' });
  // }
}
