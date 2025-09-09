import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { VersionMetricsModule } from './version-metrics/version-metrics.module';

@Module({
  imports: [VersionMetricsModule],
  controllers: [HealthController],
})
export class HealthModule {}
