import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  checkHealth() {
    try {
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: Math.floor(process.uptime()),
        environment: process.env.NODE_ENV || 'development',
      };
    } catch (error) {
      console.error('Health check error:', error);
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error.message
      };
    }
  }

  @Get('debug')
  @ApiOperation({ summary: 'Debug information' })
  getDebugInfo() {
    return {
      node: process.version,
      platform: process.platform,
      arch: process.arch,
      pid: process.pid,
      uptime: Math.floor(process.uptime()),
      memory: {
        rss: Math.round(process.memoryUsage().rss / 1024 / 1024) + ' MB',
        heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
      },
    };
  }
}
