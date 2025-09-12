import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DebugController } from './debug.controller';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ConfigModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [DebugController],
  providers: [],
})
export class DebugModule {}
