import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Controller('debug')
export class DebugController {
  constructor(
    private usersService: UsersService,
    @InjectConnection() private connection: Connection,
  ) {}

  @Get('db-connection')
  async testDbConnection() {
    try {
      const users = await this.usersService.findAll();
      return {
        status: 'success',
        message: 'Database connection working',
        userCount: users.length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Database connection failed',
        error: (error as any).message,
        timestamp: new Date().toISOString(),
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
        users: users.map((user) => ({
          id: user._id,
          email: user.email,
          name: user.name,
          authProvider: user.authProvider,
          createdAt: user.createdAt,
        })),
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'error',
        message: (error as any).message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Get('env')
  async testEnvironment() {
    return {
      nodeEnv: process.env.NODE_ENV,
      hasMongoUri: !!process.env.MONGODB_URI,
      hasJwtSecret: !!process.env.JWT_SECRET,
      mongoUriStart: process.env.MONGODB_URI?.substring(0, 20) + '...',
      timestamp: new Date().toISOString(),
    };
  }

  @Post('fix-indexes')
  async fixIndexes() {
    try {
      const db = this.connection.db;
      if (!db) throw new Error('Database connection not available');

      const collection = db.collection('users');
      const indexes = await collection.indexes();

      // Drop legacy non-sparse unique indexes that can conflict
      const dropIfExists = async (name: string) => {
        const idx = indexes.find((i) => i.name === name);
        if (idx) await collection.dropIndex(name);
      };

      await dropIfExists('googleId_1');

      // Ensure sparse indexes
      await collection.createIndex({ googleId: 1 }, { unique: true, sparse: true });

      const finalIndexes = await collection.indexes();
      return {
        status: 'success',
        message: 'Indexes fixed successfully',
        beforeIndexes: indexes.length,
        afterIndexes: finalIndexes.length,
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Failed to fix indexes',
        error: (error as any).message,
      };
    }
  }

  @Post('fix-auth-provider')
  async fixAuthProvider(@Body() body: { email: string; authProvider: string }) {
    try {
      const { email, authProvider } = body;
      if (!email || !authProvider) {
        return { status: 'error', message: 'Email and authProvider are required' };
      }

      const user = await this.usersService.findByEmail(email);
      if (!user) return { status: 'error', message: 'User not found' };

      await this.connection.collection('users').updateOne({ email }, { $set: { authProvider } });
      const updatedUser = await this.usersService.findByEmail(email);
      if (!updatedUser) return { status: 'error', message: 'Failed to retrieve updated user' };

      return {
        status: 'success',
        message: 'AuthProvider updated successfully',
        user: {
          email: updatedUser.email,
          authProvider: updatedUser.authProvider,
        },
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Failed to update authProvider',
        error: (error as any).message,
      };
    }
  }

  @Get('search-user/:email')
  async searchUserByEmail(@Param('email') email: string) {
    try {
      const cleanEmail = email?.trim()?.toLowerCase();
      if (!cleanEmail) return { status: 'error', message: 'Email parameter is required' };

      const userByEmail = await this.usersService.findByEmail(cleanEmail);
      return {
        status: 'success',
        searchEmail: cleanEmail,
        results: {
          byEmail: userByEmail
            ? {
                id: userByEmail._id,
                email: userByEmail.email,
                name: userByEmail.name,
                authProvider: userByEmail.authProvider,
                createdAt: userByEmail.createdAt,
                status: userByEmail.status,
              }
            : null,
        },
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Failed to search for user',
        error: (error as any).message,
      };
    }
  }

  @Post('make-user-admin')
  async makeUserAdmin(@Body() body: { userId?: string; email?: string }) {
    try {
      const { userId, email } = body;
      if (!userId && !email) return { status: 'error', message: 'userId or email is required' };

      const user = userId
        ? await this.usersService.findById(userId)
        : email
        ? await this.usersService.findByEmail(email)
        : null;

      if (!user) return { status: 'error', message: 'User not found' };

      const updatedUser = await this.usersService.updateUserRole(String(user._id), 'admin' as any);
      return {
        status: 'success',
        message: 'User role updated to ADMIN successfully',
        user: {
          id: updatedUser._id,
          email: updatedUser.email,
          name: updatedUser.name,
          role: updatedUser.role,
          authProvider: updatedUser.authProvider,
        },
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Failed to update user role',
        error: (error as any).message,
      };
    }
  }
}

