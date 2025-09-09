import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { VersionMetricsService } from './version-metrics.service';

@ApiTags('version-metrics')
@Controller('api/version-metrics')
export class VersionMetricsController {
  constructor(private readonly versionMetricsService: VersionMetricsService) {}

  @Post('record')
  @ApiOperation({ summary: 'Record deployment metrics for current version' })
  @ApiResponse({ status: 201, description: 'Metrics recorded successfully' })
  async recordMetrics(@Body('version') version?: string) {
    return this.versionMetricsService.recordDeploymentMetrics(version);
  }

  @Get('versions')
  @ApiOperation({ summary: 'Get all recorded versions with metrics' })
  @ApiResponse({ status: 200, description: 'List of all versions' })
  async getAllVersions() {
    return this.versionMetricsService.getAllVersions();
  }

  @Get('analysis')
  @ApiOperation({ summary: 'Get version analysis including best version' })
  @ApiResponse({ status: 200, description: 'Version analysis results' })
  async getVersionAnalysis() {
    return this.versionMetricsService.getVersionAnalysis();
  }

  @Get('best-versions-report')
  @ApiOperation({ 
    summary: 'Get comprehensive report of best versions (Georgian: რომელი იყო საუკეთესო ვერსია)',
    description: 'Analyzes previous deployments to determine which versions performed best based on multiple metrics including performance, user engagement, and system stability'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Comprehensive report showing best performing versions and improvement suggestions' 
  })
  async getBestVersionsReport() {
    return this.versionMetricsService.getBestVersionsReport();
  }
}