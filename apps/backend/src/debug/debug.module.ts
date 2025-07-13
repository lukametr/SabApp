import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DebugController } from './debug.controller';
import { MigrationService } from './migration.service';
import { UsersModule } from '../users/users.module';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  controllers: [DebugController],
  providers: [MigrationService],
})
export class DebugModule {}
