import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class MigrationService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async fixNullGoogleId() {
    try {
      console.log('🔧 Migration: Starting null googleId fix...');
      
      // Find all users with googleId: null
      const nullGoogleIdUsers = await this.userModel.find({ googleId: null }).exec();
      console.log(`Found ${nullGoogleIdUsers.length} users with null googleId`);

      if (nullGoogleIdUsers.length === 0) {
        return {
          status: 'success',
          message: 'No null googleId records found',
          modifiedCount: 0
        };
      }

      // Update all users with googleId: null to remove the googleId field entirely
      const result = await this.userModel.updateMany(
        { googleId: null },
        { $unset: { googleId: "" } }
      ).exec();

      console.log(`✅ Migration: Fixed ${result.modifiedCount} records`);

      return {
        status: 'success',
        message: 'Successfully removed null googleId fields',
        modifiedCount: result.modifiedCount,
        foundRecords: nullGoogleIdUsers.length
      };
    } catch (error) {
      console.error('❌ Migration error:', error);
      return {
        status: 'error',
        message: error.message
      };
    }
  }
}
