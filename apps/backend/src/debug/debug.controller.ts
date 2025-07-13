import { Controller, Get, Post } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { MigrationService } from './migration.service';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Controller('debug')
export class DebugController {
  constructor(
    private usersService: UsersService,
    private migrationService: MigrationService,
    @InjectConnection() private connection: Connection,
  ) {}

  @Get('db-connection')
  async testDbConnection() {
    try {
      // Simple database connection test
      const users = await this.usersService.findAll();
      return {
        status: 'success',
        message: 'Database connection working',
        userCount: users.length,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Database connection failed',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  @Get('users')
  async listUsers() {
    try {
      const users = await this.usersService.findAll();
      return {
        status: 'success',
        userCount: users.length,
        users: users.map(user => ({
          id: user._id,
          email: user.email,
          name: user.name,
          googleId: user.googleId,
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
    return this.migrationService.fixNullGoogleId();
  }

  @Get('env')
  async testEnvironment() {
    return {
      nodeEnv: process.env.NODE_ENV,
      hasMongoUri: !!process.env.MONGODB_URI,
      hasJwtSecret: !!process.env.JWT_SECRET,
      mongoUriStart: process.env.MONGODB_URI?.substring(0, 20) + '...',
      timestamp: new Date().toISOString()
    };
  }

  @Post('fix-indexes')
  async fixIndexes() {
    try {
      console.log('🔧 Starting index fix...');
      
      const db = this.connection.db;
      if (!db) {
        throw new Error('Database connection not available');
      }
      
      const collection = db.collection('users');
      
      // Get current indexes
      const indexes = await collection.indexes();
      console.log('📋 Current indexes:', JSON.stringify(indexes, null, 2));
      
      // Check if googleId_1 index exists and drop it
      const googleIdIndex = indexes.find(idx => idx.name === 'googleId_1');
      if (googleIdIndex) {
        console.log('🗑️ Dropping old googleId_1 index...');
        await collection.dropIndex('googleId_1');
        console.log('✅ Old googleId_1 index dropped');
      }
      
      // Recreate the googleId index as sparse
      console.log('🔨 Creating new sparse googleId index...');
      await collection.createIndex({ googleId: 1 }, { unique: true, sparse: true });
      console.log('✅ New sparse googleId index created');
      
      // Also ensure other indexes are sparse if needed
      const personalNumberIndex = indexes.find(idx => idx.name === 'personalNumber_1');
      if (personalNumberIndex && !personalNumberIndex.sparse) {
        console.log('🗑️ Dropping old personalNumber_1 index...');
        await collection.dropIndex('personalNumber_1');
        console.log('🔨 Creating new sparse personalNumber index...');
        await collection.createIndex({ personalNumber: 1 }, { unique: true, sparse: true });
        console.log('✅ New sparse personalNumber index created');
      }
      
      const phoneNumberIndex = indexes.find(idx => idx.name === 'phoneNumber_1');
      if (phoneNumberIndex && !phoneNumberIndex.sparse) {
        console.log('🗑️ Dropping old phoneNumber_1 index...');
        await collection.dropIndex('phoneNumber_1');
        console.log('🔨 Creating new sparse phoneNumber index...');
        await collection.createIndex({ phoneNumber: 1 }, { unique: true, sparse: true });
        console.log('✅ New sparse phoneNumber index created');
      }
      
      // Get final indexes
      const finalIndexes = await collection.indexes();
      
      return {
        status: 'success',
        message: 'Indexes fixed successfully',
        beforeIndexes: indexes.length,
        afterIndexes: finalIndexes.length,
        finalIndexes: finalIndexes.map(idx => ({
          name: idx.name,
          key: idx.key,
          unique: idx.unique,
          sparse: idx.sparse
        })),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Error fixing indexes:', error);
      return {
        status: 'error',
        message: 'Failed to fix indexes',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}
