import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VersionMetricsController } from './version-metrics.controller';
import { VersionMetricsService } from './version-metrics.service';
import { VersionMetrics, VersionMetricsSchema } from './schemas/version-metrics.schema';
import { UsersModule } from '../users/users.module';
import { DocumentsModule } from '../documents/documents.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VersionMetrics.name, schema: VersionMetricsSchema },
    ]),
    UsersModule,
    DocumentsModule,
  ],
  controllers: [VersionMetricsController],
  providers: [VersionMetricsService],
  exports: [VersionMetricsService],
})
export class VersionMetricsModule {}