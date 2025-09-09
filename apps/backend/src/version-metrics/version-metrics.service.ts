import { Injectable, Logger } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { VersionMetrics, VersionMetricsDocument, DeploymentStatus } from './schemas/version-metrics.schema';
import { UsersService } from '../users/users.service';
import { DocumentsService } from '../documents/documents.service';

@Injectable()
export class VersionMetricsService {
  private readonly logger = new Logger(VersionMetricsService.name);

  constructor(
    @InjectModel(VersionMetrics.name) private versionMetricsModel: Model<VersionMetricsDocument>,
    @InjectConnection() private connection: Connection,
    private usersService: UsersService,
    private documentsService: DocumentsService,
  ) {}

  async recordDeploymentMetrics(version?: string): Promise<VersionMetricsDocument> {
    try {
      const versionId = version || this.generateVersionId();
      this.logger.log(`Recording metrics for version: ${versionId}`);

      // Collect current metrics
      const performance = await this.collectPerformanceMetrics();
      const userMetrics = await this.collectUserMetrics();
      const systemMetrics = await this.collectSystemMetrics();
      const score = this.calculateQualityScore(performance, userMetrics, systemMetrics);

      const metrics = new this.versionMetricsModel({
        version: versionId,
        deploymentDate: new Date(),
        status: DeploymentStatus.DEPLOYED,
        commitHash: process.env.GIT_COMMIT || null,
        commitMessage: process.env.GIT_COMMIT_MESSAGE || null,
        performance,
        userMetrics,
        systemMetrics,
        score,
      });

      const savedMetrics = await metrics.save();
      this.logger.log(`Metrics recorded successfully for version ${versionId} with score: ${score}`);
      
      return savedMetrics;
    } catch (error) {
      this.logger.error('Failed to record deployment metrics', error);
      throw error;
    }
  }

  async getAllVersions(): Promise<VersionMetricsDocument[]> {
    return this.versionMetricsModel
      .find()
      .sort({ deploymentDate: -1 })
      .limit(50) // Limit to last 50 deployments
      .exec();
  }

  async getVersionAnalysis(): Promise<{
    bestVersion: VersionMetricsDocument | null;
    worstVersion: VersionMetricsDocument | null;
    averageScore: number;
    totalVersions: number;
    recentTrend: string;
    recommendations: string[];
  }> {
    const versions = await this.getAllVersions();
    
    if (versions.length === 0) {
      return {
        bestVersion: null,
        worstVersion: null,
        averageScore: 0,
        totalVersions: 0,
        recentTrend: 'insufficient-data',
        recommendations: ['Deploy more versions to generate meaningful analysis'],
      };
    }

    // Find best and worst versions
    const bestVersion = versions.reduce((best, current) => 
      current.score > best.score ? current : best
    );
    
    const worstVersion = versions.reduce((worst, current) => 
      current.score < worst.score ? current : worst
    );

    // Calculate average score
    const averageScore = versions.reduce((sum, v) => sum + v.score, 0) / versions.length;

    // Analyze recent trend (last 5 versions vs previous 5)
    const recentTrend = this.analyzeTrend(versions);

    // Generate recommendations
    const recommendations = this.generateRecommendations(versions);

    return {
      bestVersion,
      worstVersion,
      averageScore: Math.round(averageScore * 100) / 100,
      totalVersions: versions.length,
      recentTrend,
      recommendations,
    };
  }

  async getBestVersionsReport(): Promise<{
    summary: any;
    topVersions: VersionMetricsDocument[];
    performanceComparison: any;
    improvementSuggestions: string[];
  }> {
    const analysis = await this.getVersionAnalysis();
    const versions = await this.getAllVersions();
    
    // Get top 5 best versions
    const topVersions = versions
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    // Performance comparison between best and recent
    const recentVersion = versions[0];
    const performanceComparison = analysis.bestVersion && recentVersion ? {
      scoreDifference: recentVersion.score - analysis.bestVersion.score,
      responseTimeDifference: recentVersion.performance.responseTime - analysis.bestVersion.performance.responseTime,
      memoryUsageDifference: recentVersion.performance.memoryUsage - analysis.bestVersion.performance.memoryUsage,
      errorRateDifference: recentVersion.performance.errorRate - analysis.bestVersion.performance.errorRate,
    } : null;

    return {
      summary: analysis,
      topVersions,
      performanceComparison,
      improvementSuggestions: this.generateImprovementSuggestions(versions),
    };
  }

  private generateVersionId(): string {
    return `v${Date.now()}`;
  }

  private async collectPerformanceMetrics() {
    const memUsage = process.memoryUsage();
    
    // Simulate response time measurement (in real app, you'd collect this from actual requests)
    const responseTime = Math.random() * 200 + 50; // 50-250ms
    
    return {
      responseTime: Math.round(responseTime),
      memoryUsage: Math.round(memUsage.heapUsed / 1024 / 1024),
      cpuUsage: Math.round(Math.random() * 30 + 10), // Simulate CPU usage
      uptime: Math.round(process.uptime()),
      errorRate: Math.random() * 2, // Low error rate
    };
  }

  private async collectUserMetrics() {
    try {
      // Get user statistics from the last 24 hours
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const totalUsers = await this.usersService.getTotalUsersCount();
      const activeUsers = await this.usersService.getActiveUsersCount(yesterday);
      const newUsers = await this.usersService.getNewUsersCount(yesterday);
      
      // Get document statistics
      const documentsCreated = await this.documentsService.getDocumentsCreatedSince(yesterday);
      
      return {
        totalUsers,
        activeUsers,
        newUsers,
        documentsCreated,
        averageSessionDuration: Math.round(Math.random() * 30 + 15), // Simulate session duration
      };
    } catch (error) {
      this.logger.warn('Failed to collect user metrics, using defaults', error);
      return {
        totalUsers: 0,
        activeUsers: 0,
        newUsers: 0,
        documentsCreated: 0,
        averageSessionDuration: 0,
      };
    }
  }

  private async collectSystemMetrics() {
    const dbConnected = this.connection.readyState === 1;
    
    // Measure database response time
    const dbStartTime = Date.now();
    try {
      await this.connection.db?.admin().ping();
      const dbResponseTime = Date.now() - dbStartTime;
      
      return {
        databaseConnected: dbConnected,
        databaseResponseTime: dbResponseTime,
        apiEndpointsHealthy: 8, // Assume 8 out of 10 endpoints are healthy
        totalApiEndpoints: 10,
        criticalErrors: 0,
      };
    } catch (error) {
      return {
        databaseConnected: false,
        databaseResponseTime: 5000, // Timeout
        apiEndpointsHealthy: 0,
        totalApiEndpoints: 10,
        criticalErrors: 1,
      };
    }
  }

  private calculateQualityScore(performance: any, userMetrics: any, systemMetrics: any): number {
    let score = 100;

    // Performance penalties
    if (performance.responseTime > 200) score -= (performance.responseTime - 200) / 10;
    if (performance.memoryUsage > 500) score -= (performance.memoryUsage - 500) / 50;
    if (performance.errorRate > 1) score -= performance.errorRate * 10;

    // System penalties
    if (!systemMetrics.databaseConnected) score -= 30;
    if (systemMetrics.databaseResponseTime > 100) score -= (systemMetrics.databaseResponseTime - 100) / 20;
    if (systemMetrics.criticalErrors > 0) score -= systemMetrics.criticalErrors * 15;

    // User engagement bonuses
    if (userMetrics.activeUsers > 0) score += Math.min(userMetrics.activeUsers * 2, 10);
    if (userMetrics.documentsCreated > 5) score += Math.min(userMetrics.documentsCreated, 15);

    return Math.max(0, Math.min(100, Math.round(score * 100) / 100));
  }

  private analyzeTrend(versions: VersionMetricsDocument[]): string {
    if (versions.length < 3) return 'insufficient-data';
    
    const recent = versions.slice(0, Math.min(3, versions.length));
    const recentAvg = recent.reduce((sum, v) => sum + v.score, 0) / recent.length;
    
    const older = versions.slice(3, Math.min(6, versions.length));
    if (older.length === 0) return 'insufficient-data';
    
    const olderAvg = older.reduce((sum, v) => sum + v.score, 0) / older.length;
    
    const difference = recentAvg - olderAvg;
    
    if (difference > 5) return 'improving';
    if (difference < -5) return 'declining';
    return 'stable';
  }

  private generateRecommendations(versions: VersionMetricsDocument[]): string[] {
    const recommendations: string[] = [];
    
    if (versions.length === 0) {
      return ['No deployment data available'];
    }

    const latest = versions[0];
    
    if (latest.performance.responseTime > 200) {
      recommendations.push('Response time is high - consider optimizing API endpoints');
    }
    
    if (latest.performance.memoryUsage > 400) {
      recommendations.push('Memory usage is elevated - check for memory leaks');
    }
    
    if (latest.performance.errorRate > 2) {
      recommendations.push('Error rate is concerning - review error logs and fix bugs');
    }
    
    if (!latest.systemMetrics.databaseConnected) {
      recommendations.push('Database connectivity issues detected - check connection stability');
    }
    
    if (latest.userMetrics.activeUsers === 0) {
      recommendations.push('No active users detected - verify user authentication system');
    }

    if (recommendations.length === 0) {
      recommendations.push('System is performing well - monitor trends for continuous improvement');
    }
    
    return recommendations;
  }

  private generateImprovementSuggestions(versions: VersionMetricsDocument[]): string[] {
    const suggestions: string[] = [];
    
    if (versions.length < 2) {
      return ['Deploy more versions to generate improvement suggestions'];
    }

    // Compare current with best performing version
    const current = versions[0];
    const best = versions.reduce((best, v) => v.score > best.score ? v : best);
    
    if (current.score < best.score) {
      suggestions.push(`Current version scores ${current.score.toFixed(1)}, but best version achieved ${best.score.toFixed(1)}`);
      
      if (current.performance.responseTime > best.performance.responseTime * 1.2) {
        suggestions.push('Focus on response time optimization - previous versions achieved better performance');
      }
      
      if (current.performance.errorRate > best.performance.errorRate * 1.5) {
        suggestions.push('Error handling needs improvement - refer to lower error rate versions');
      }
      
      if (current.userMetrics.activeUsers < best.userMetrics.activeUsers * 0.8) {
        suggestions.push('User engagement has declined - analyze what made previous versions more engaging');
      }
    } else {
      suggestions.push('Current version is performing at or near peak performance levels');
    }
    
    return suggestions;
  }
}