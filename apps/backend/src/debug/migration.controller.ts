import { Controller, Post, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';

@Controller('debug/migration')
export class MigrationController {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  @Get('check-null-googleid')
  async checkNullGoogleId() {
    try {
      const nullGoogleIdUsers = await this.userModel.find({ googleId: null }).exec();
      return {
        status: 'success',
        nullGoogleIdCount: nullGoogleIdUsers.length,
        users: nullGoogleIdUsers.map(user => ({
          id: user._id,
          email: user.email,
          name: user.name,
          authProvider: user.authProvider,
          createdAt: user.createdAt
        })),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  @Post('fix-null-googleid')
  async fixNullGoogleId() {
    try {
      // Update all users with googleId: null to remove the googleId field entirely
      const result = await this.userModel.updateMany(
        { googleId: null },
        { $unset: { googleId: "" } }
      ).exec();

      return {
        status: 'success',
        message: 'Successfully removed null googleId fields',
        modifiedCount: result.modifiedCount,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  @Get('indexes')
  async checkIndexes() {
    try {
      const indexes = await this.userModel.collection.getIndexes();
      return {
        status: 'success',
        indexes: indexes,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}
