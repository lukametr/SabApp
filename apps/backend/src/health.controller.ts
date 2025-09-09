import { Controller, Get, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { VersionMetricsService } from './version-metrics/version-metrics.service';

@Controller()
export class HealthController {
  private readonly logger = new Logger(HealthController.name);
  private metricsRecorded = false;

  constructor(
    @InjectConnection() private connection: Connection,
    private versionMetricsService: VersionMetricsService,
  ) {
    // Record metrics on first health check (startup)
    this.recordStartupMetrics();
  }

  @Get('health')
  async checkHealth() {
    const mongoStatus = this.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      mongodb: mongoStatus,
      environment: process.env.NODE_ENV || 'development',
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      },
      versionMetrics: {
        recorded: this.metricsRecorded,
        endpoint: '/api/version-metrics/analysis'
      }
    };
  }

  private async recordStartupMetrics() {
    try {
      // Wait a bit for the app to fully initialize
      setTimeout(async () => {
        if (!this.metricsRecorded) {
          this.logger.log('Recording startup metrics...');
          await this.versionMetricsService.recordDeploymentMetrics();
          this.metricsRecorded = true;
          this.logger.log('Startup metrics recorded successfully');
        }
      }, 5000); // 5 second delay
    } catch (error) {
      this.logger.error('Failed to record startup metrics', error);
    }
  }
}
