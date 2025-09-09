import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VersionMetricsDocument = VersionMetrics & Document;

export enum DeploymentStatus {
  DEPLOYED = 'deployed',
  FAILED = 'failed',
  ROLLBACK = 'rollback',
}

@Schema({ _id: false })
class PerformanceMetrics {
  @Prop({ required: true })
  responseTime: number; // Average response time in ms

  @Prop({ required: true })
  memoryUsage: number; // Memory usage in MB

  @Prop({ required: true })
  cpuUsage: number; // CPU usage percentage

  @Prop({ required: true })
  uptime: number; // Uptime in seconds

  @Prop({ required: true, default: 0 })
  errorRate: number; // Error rate percentage
}

@Schema({ _id: false })
class UserMetrics {
  @Prop({ required: true, default: 0 })
  totalUsers: number;

  @Prop({ required: true, default: 0 })
  activeUsers: number; // Users active in last 24h

  @Prop({ required: true, default: 0 })
  newUsers: number; // New users since deployment

  @Prop({ required: true, default: 0 })
  documentsCreated: number; // Documents created since deployment

  @Prop({ required: true, default: 0 })
  averageSessionDuration: number; // In minutes
}

@Schema({ _id: false })
class SystemMetrics {
  @Prop({ required: true })
  databaseConnected: boolean;

  @Prop({ required: true, default: 0 })
  databaseResponseTime: number; // DB response time in ms

  @Prop({ required: true, default: 0 })
  apiEndpointsHealthy: number; // Number of healthy endpoints

  @Prop({ required: true, default: 0 })
  totalApiEndpoints: number; // Total API endpoints

  @Prop({ required: true, default: 0 })
  criticalErrors: number; // Critical errors since deployment
}

@Schema({ timestamps: true })
export class VersionMetrics {
  @Prop({ required: true })
  version: string; // Version identifier (commit hash, tag, or timestamp)

  @Prop({ required: true })
  deploymentDate: Date;

  @Prop({ type: String, enum: DeploymentStatus, default: DeploymentStatus.DEPLOYED })
  status: DeploymentStatus;

  @Prop({ required: false })
  commitHash?: string;

  @Prop({ required: false })
  commitMessage?: string;

  @Prop({ required: false })
  deploymentDuration?: number; // Deployment time in seconds

  @Prop({ type: PerformanceMetrics, required: true })
  performance: PerformanceMetrics;

  @Prop({ type: UserMetrics, required: true })
  userMetrics: UserMetrics;

  @Prop({ type: SystemMetrics, required: true })
  systemMetrics: SystemMetrics;

  @Prop({ required: false })
  notes?: string; // Optional notes about the deployment

  @Prop({ required: true, default: 0 })
  score: number; // Overall quality score (0-100)

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const VersionMetricsSchema = SchemaFactory.createForClass(VersionMetrics);

// Transform _id to id for frontend compatibility
VersionMetricsSchema.set('toJSON', {
  transform: function(_doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});